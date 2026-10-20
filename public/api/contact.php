<?php
/**
 * "Start a project" form handler for physarum.org (cPanel / shared hosting).
 * Receives the brief from /contact and emails it to the business inbox.
 *
 * Deployed as a static file next to the exported site: /api/contact.php
 */

declare(strict_types=1);

// business@ is a Google Workspace group (MX points to Google). The group must allow
// posts from "Anyone on the web" so website briefs aren't rejected.
const RECIPIENT = 'business@physarum.org';
// A distinct sender: mail "from" the group to itself via another server looks spoofed to Google.
// It doesn't need a mailbox; SPF for physarum.org must include this server (spf.web-hosting.com).
const SENDER = 'website@physarum.org';
const ALLOWED_ORIGINS = ['https://physarum.org', 'https://www.physarum.org'];
const MAX_PER_HOUR = 5;

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

// Only accept submissions from our own pages.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && !in_array($origin, ALLOWED_ORIGINS, true)) {
    respond(403, ['ok' => false, 'error' => 'Forbidden.']);
}

// Honeypot: real visitors never fill this in. Pretend success so bots move on.
if (!empty($_POST['company_website'])) {
    respond(200, ['ok' => true]);
}

// Simple per-IP rate limit.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$bucket = sys_get_temp_dir() . '/physarum-contact-' . hash('sha256', $ip);
$now = time();
$hits = array_filter(
    is_file($bucket) ? (array) json_decode((string) file_get_contents($bucket), true) : [],
    fn($t) => is_int($t) && $t > $now - 3600
);
if (count($hits) >= MAX_PER_HOUR) {
    respond(429, ['ok' => false, 'error' => 'Too many submissions. Please email us instead.']);
}

function field(string $key, int $max): string
{
    $v = trim((string) ($_POST[$key] ?? ''));
    return mb_substr($v, 0, $max);
}

// Strip line breaks from anything that ends up in a mail header.
function header_safe(string $v): string
{
    return trim(preg_replace('/[\r\n]+/', ' ', $v) ?? '');
}

$name = header_safe(field('name', 120));
$email = header_safe(field('email', 200));
$company = field('company', 160);
$category = field('category', 100);
$budget = field('budget', 50);
$timeline = field('timeline', 50);
$message = field('message', 5000);
$nda = !empty($_POST['nda']);

if ($name === '') respond(422, ['ok' => false, 'error' => 'Please enter your name.']);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) respond(422, ['ok' => false, 'error' => 'Please enter a valid email address.']);
if ($category === '') respond(422, ['ok' => false, 'error' => 'Please choose what you need help with.']);
if ($budget === '') respond(422, ['ok' => false, 'error' => 'Please choose a budget range.']);
if (mb_strlen($message) < 10) respond(422, ['ok' => false, 'error' => 'Please tell us a little about the project (at least 10 characters).']);

$subject = 'New project brief: ' . header_safe($category) . ' — ' . $name;
$lines = [
    'New project brief from physarum.org',
    '',
    'Name:      ' . $name,
    'Email:     ' . $email,
    'Company:   ' . ($company !== '' ? $company : '—'),
    'Service:   ' . $category,
    'Budget:    ' . $budget,
    'Timeline:  ' . ($timeline !== '' ? $timeline : '—'),
    'NDA first: ' . ($nda ? 'Yes' : 'No'),
    '',
    'Project:',
    $message,
    '',
    '—',
    'Sent ' . gmdate('Y-m-d H:i') . ' UTC from ' . $ip . '. Reply to this email to answer the client directly.',
];

$headers = implode("\r\n", [
    'From: Physarum Website <' . SENDER . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);

$sent = mail(
    RECIPIENT,
    '=?UTF-8?B?' . base64_encode($subject) . '?=',
    implode("\r\n", $lines),
    $headers,
    '-f' . SENDER
);

if (!$sent) {
    respond(500, ['ok' => false, 'error' => 'We couldn’t send your brief. Please email ' . RECIPIENT . ' instead.']);
}

$hits[] = $now;
@file_put_contents($bucket, json_encode(array_values($hits)), LOCK_EX);

respond(200, ['ok' => true]);
