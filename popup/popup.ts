// popup/popup.ts
// AccessiFix Extension Popup Script
// Handles UI logic for browser action popup

// Simulated function to fetch detected accessibility issues (replace with real integration)
function getAccessibilityIssues(): string[] {
  // TODO: Integrate with DOMScanner or background script for real issues
  return [
    'Low contrast detected on header',
    'Missing ARIA label on navigation',
    'Form input missing accessible name',
  ];
}

function updateFeedbackPanel() {
  const issueList = document.getElementById('issue-list');
  if (!issueList) return;
  const issues = getAccessibilityIssues();
  issueList.innerHTML = '';
  if (issues.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No issues detected.';
    issueList.appendChild(li);
  } else {
    issues.forEach((issue) => {
      const li = document.createElement('li');
      li.textContent = issue;
      issueList.appendChild(li);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateFeedbackPanel();
});
