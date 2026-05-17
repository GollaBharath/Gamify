# Security Policy

## Supported Versions

Currently, only the `main` branch is receiving security updates.

| Version | Supported          |
| ------- | ------------------ |
| `main`  | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

Security is a top priority for the Gamify platform. 

If you discover any security vulnerability (e.g., ways to spoof points, unauthorized API access, or data exposure), please **do not** report it by opening a public GitHub issue. 
Instead, please open a draft security advisory if GitHub Advanced Security is enabled, or contact the maintainers directly via email.

Please provide the following details in your report:
- A description of the vulnerability.
- Steps to reproduce the issue.
- Potential impact (especially regarding leaderboard manipulation).
- Any suggested mitigations.

We will endeavor to respond to your report within 48 hours and provide an estimated timeline for a patch.

## Secure Usage
When deploying Gamify, ensure all API endpoints validating "actions" for points are strictly verified server-side. Do not trust client-side payloads for point calculation without backend validation.
