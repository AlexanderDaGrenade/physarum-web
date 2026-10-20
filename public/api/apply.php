<?php
/**
 * Careers application handler for physarum.org (cPanel / shared hosting).
 * Receives the application from /careers and emails it, with the CV attached,
 * to the careers inbox. The CV is never stored on the server.
 *
 * Rules enforced here are shown on the form (see lib/careers.ts → cvRules):
 * name, valid email, a role, at least 20 characters about yourself, and a CV in
 * PDF, DOC or DOCX format up to 5 MB.
 */

declare(strict_types=1);

// careers@ is a Google Workspace group (MX points to Google). The group must allow
// posts from "Anyone on the web" so applications aren't rejected.
const RECIPIENT = 'careers@physarum.org';
const SENDER = 'website@physarum.org';
const ALLOWED_ORIGINS = ['https://physarum.org', 'https://www.physarum.org'];
const MAX_PER_HOUR = 3;
const MAX_CV_BYTES = 5 * 1024 * 1024;
const CV_TYPES = [
    'pdf' => ['application/pdf'],
    'doc' => ['application/msword', 'application/x-ole-storage', 'application/CDFV2', 'application/vnd.ms-office'],
    'docx' => ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/octet-stream'],
];

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'Method not allowed.']);
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && !in_array($origin, ALLOWED_ORIGINS, true)) {
    respond(403, ['ok' => false, 'error' => 'Forbidden.']);
}

// A request bigger than the server's post_max_size arrives with empty $_POST.
if (empty($_POST) && (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
    respond(413, ['ok' => false, 'error' => 'Your CV is too large. Please upload a file up to 5 MB.']);
}

if (!empty($_POST['company_website'])) {
    respond(200, ['ok' => true]);
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$bucket = sys_get_temp_dir() . '/physarum-apply-' . hash('sha256', $ip);
$now = time();
$hits = array_filter(
    is_file($bucket) ? (array) json_decode((string) file_get_contents($bucket), true) : [],
    fn($t) => is_int($t) && $t > $now - 3600
);
if (count($hits) >= MAX_PER_HOUR) {
    respond(429, ['ok' => false, 'error' => 'Too many applications from this connection. Please email careers@physarum.org instead.']);
}

function field(string $key, int $max): string
{
    return mb_substr(trim((string) ($_POST[$key] ?? '')), 0, $max);
}

function header_safe(string $v): string
{
    return trim(preg_replace('/[\r\n]+/', ' ', $v) ?? '');
}

$name = header_safe(field('name', 120));
$email = header_safe(field('email', 200));
$phone = field('phone', 40);
$role = header_safe(field('role', 120));
$linkedin = field('linkedin', 300);
$portfolio = field('portfolio', 300);
$message = field('message', 5000);

if ($name === '') respond(422, ['ok' => false, 'error' => 'Please enter your name.']);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) respond(422, ['ok' => false, 'error' => 'Please enter a valid email address.']);
if ($role === '') respond(422, ['ok' => false, 'error' => 'Please choose the role you’re applying for.']);
if (mb_strlen($message) < 20) respond(422, ['ok' => false, 'error' => 'Please tell us a little about yourself (at least 20 characters).']);

// CV upload
$cv = $_FILES['cv'] ?? null;
if (!$cv || ($cv['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
    respond(422, ['ok' => false, 'error' => 'Please attach your CV (PDF, DOC or DOCX, up to 5 MB).']);
}
if (in_array($cv['error'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true) || $cv['size'] > MAX_CV_BYTES) {
    respond(422, ['ok' => false, 'error' => 'Your CV is too large. Please upload a file up to 5 MB.']);
}
if ($cv['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($cv['tmp_name'])) {
    respond(422, ['ok' => false, 'error' => 'We couldn’t read your CV. Please try again or email it to careers@physarum.org.']);
}
$ext = strtolower(pathinfo((string) $cv['name'], PATHINFO_EXTENSION));
if (!isset(CV_TYPES[$ext])) {
    respond(422, ['ok' => false, 'error' => 'Please upload your CV as a PDF, DOC or DOCX file.']);
}
$mime = function_exists('finfo_open') ? (string) finfo_file(finfo_open(FILEINFO_MIME_TYPE), $cv['tmp_name']) : '';
if ($mime !== '' && !in_array($mime, CV_TYPES[$ext], true)) {
    respond(422, ['ok' => false, 'error' => 'That file doesn’t look like a PDF, DOC or DOCX. Please check your CV and try again.']);
}

$safeBase = preg_replace('/[^A-Za-z0-9._-]+/', '-', pathinfo((string) $cv['name'], PATHINFO_FILENAME)) ?: 'cv';
$filename = mb_substr($safeBase, 0, 80) . '.' . $ext;
$data = (string) file_get_contents($cv['tmp_name']);

$subject = 'Application: ' . $role . ' — ' . $name;
$text = implode("\r\n", [
    'New application from physarum.org/careers',
    '',
    'Role:       ' . $role,
    'Name:       ' . $name,
    'Email:      ' . $email,
    'Phone:      ' . ($phone !== '' ? $phone : '—'),
    'LinkedIn:   ' . ($linkedin !== '' ? $linkedin : '—'),
    'Portfolio:  ' . ($portfolio !== '' ? $portfolio : '—'),
    '',
    'About them:',
    $message,
    '',
    'CV attached: ' . $filename,
    '—',
    'Sent ' . gmdate('Y-m-d H:i') . ' UTC from ' . $ip . '. Reply to this email to answer the applicant directly.',
]);

$boundary = 'physarum-' . bin2hex(random_bytes(12));
$body = implode("\r\n", [
    '--' . $boundary,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    $text,
    '',
    '--' . $boundary,
    'Content-Type: ' . (CV_TYPES[$ext][0]) . '; name="' . $filename . '"',
    'Content-Transfer-Encoding: base64',
    'Content-Disposition: attachment; filename="' . $filename . '"',
    '',
    chunk_split(base64_encode($data)),
    '--' . $boundary . '--',
]);

$headers = implode("\r\n", [
    'From: Physarum Careers <' . SENDER . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="' . $boundary . '"',
]);

$sent = mail(RECIPIENT, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers, '-f' . SENDER);

if (!$sent) {
    respond(500, ['ok' => false, 'error' => 'We couldn’t send your application. Please email your CV to ' . RECIPIENT . ' instead.']);
}

$hits[] = $now;
@file_put_contents($bucket, json_encode(array_values($hits)), LOCK_EX);

respond(200, ['ok' => true]);
