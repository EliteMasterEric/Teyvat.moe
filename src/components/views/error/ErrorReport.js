import newGithubIssueUrl from 'new-github-issue-url';
import { exportDataJSON } from '~/components/preferences/DataExport';

export const generateReportURL = (name, message, stackTrace) => {
  const preferencesData = exportDataJSON();

  return newGithubIssueUrl({
    user: 'genshinmap',
    repo: 'genshinmap.github.io',
    title: `[CRASH] ${name} : ${message}`,
    body: `<!--
  We apologize that you encountered this error,
  and thank you for taking the time to make the app better by reporting it.
  
  To maximize our ability to help you, please fill out the following form thoroughly.
  Any missing details will require follow-up, which delays the issue being resolved.
-->

**Describe the crash**
<!--
  A clear and concise description of what the bug is.
  How is the app behaving? What do you expect to happen?
-->

**Steps To Produce**
<!--
  Please provide a step-by-step procedure of what you did before the crash occurred.
-->

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Screenshots**
<!--
  If applicable, add screenshots or link a video to help explain your problem.
-->

**Device Specs (please complete the following information):**

- App Version: [see options tab, e.g. 0.8.4]
- Device: [e.g. iPhone6, PC, Pixel 4a]
- OS: [e.g. iOS8.1, Android 11, Windows 10]
- Browser: [e.g. chrome, safari]
- Browser Version: [e.g. 22]

**Additional context**
<!--
  Add any other context about the problem here.
-->

**Error Message**
<!--
  This is the error as reported by the app.
  Please do not modify or remove it.
-->

\`\`\`

${name} : ${message}
${stackTrace}

\`\`\`

**Current User Preferences**
<!--
  This is the current saved data as reported by the app.
-->

\`\`\`

${preferencesData}

\`\`\`

    `,
    labels: ['bug'],
  });
};
