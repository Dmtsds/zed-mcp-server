import { spawn } from 'child_process';

/**
 * Открыть URL в браузере Windows
 */
export function openBrowser(url) {
  return new Promise((resolve, reject) => {
    // Используем start команды для разных браузеров
    const commands = [
      `start chrome "${url}"`,
      `start msedge "${url}"`,
      `start firefox "${url}"`,
      `start "" "${url}"`,
    ];

    let completed = false;

    function tryOpenCommand(cmd) {
      if (completed) return;

      const process = spawn('cmd.exe', ['/c', cmd], {
        shell: true,
        windowsHide: true,
      });

      process.on('error', (err) => {
        if (completed) return;
        console.error(`Ошибка при открытии браузера: ${err.message}`);
        // Попробуем следующую команду
      });

      process.on('close', (code) => {
        if (completed) return;
        completed = true;
        resolve({ success: true, message: 'Браузер успешно открыт' });
      });
    }

    // Попытаемся открыть первый браузер
    tryOpenCommand(commands[0]);
  });
}

/**
 * Открыть URL в браузере с параметрами
 */
export function openBrowserWithArgs(url, args = []) {
  return new Promise((resolve, reject) => {
    const browserCommands = [
      {
        name: 'Chrome',
        commands: [['chrome', ...args, url], ['chrome.exe', ...args, url]],
      },
      {
        name: 'Microsoft Edge',
        commands: [['msedge', ...args, url], ['msedge.exe', ...args, url]],
      },
      {
        name: 'Firefox',
        commands: [['firefox', ...args, url], ['firefox.exe', ...args, url]],
      },
    ];

    let completed = false;

    function tryBrowser(browser) {
      if (completed) return;

      for (const cmd of browser.commands) {
        const process = spawn(cmd[0], cmd.slice(1), {
          shell: true,
          windowsHide: true,
        });

        process.on('error', () => {
          // Попробуем следующий браузер
        });

        process.on('close', (code) => {
          if (!completed && code === 0) {
            completed = true;
            resolve({ success: true, message: `Браузер ${browser.name} успешно открыт` });
          }
        });
      }
    }

    // Попробуем все браузеры
    tryBrowser(browserCommands[0]);
  });
}

/**
 * Открыть несколько URL в разных вкладках
 */
export function openMultipleBrowsers(urls) {
  return new Promise((resolve, reject) => {
    const promises = urls.map((url) => openBrowser(url));
    Promise.all(promises)
      .then(() => {
        resolve({ success: true, message: `Открыто ${urls.length} вкладок` });
      })
      .catch((error) => {
        reject(error);
      });
  });
}