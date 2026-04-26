import { spawn } from 'child_process';

/**
 * Делать скриншот всего экрана
 */
export function takeScreenshot(savePath = null) {
  return new Promise((resolve, reject) => {
    const scriptPath = 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe';
    
    const command = `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('{PRTSC}'); $WshShell = New-Object -ComObject WScript.Shell; $WshShell.SendKeys('^{ESC}'); if ($env:TEMP) { Copy-Item "$env:TEMP\\screenshot.png" "${savePath || 'screenshot.png'}" -Force; Write-Output "Screenshot saved to ${savePath || 'screenshot.png'}" }`;

    const process = spawn(scriptPath, ['-Command', command], {
      shell: true,
      windowsHide: true,
    });

    let output = '';
    let errorOutput = '';

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve({
          success: true,
          message: 'Скриншот сделан',
          output: output.trim(),
        });
      } else {
        reject({
          success: false,
          message: 'Ошибка при создании скриншота',
          error: errorOutput.trim(),
        });
      }
    });

    process.on('error', (error) => {
      reject({
        success: false,
        message: 'Ошибка процесса',
        error: error.message,
      });
    });
  });
}

/**
 * Делать скриншот области экрана
 */
export function takeAreaScreenshot(x, y, width, height, savePath = null) {
  return new Promise((resolve, reject) => {
    const scriptPath = 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe';
    
    const command = `Add-Type -AssemblyName System.Windows.Forms; Add-Type -AssemblyName System.Drawing; $screen = [System.Windows.Forms.Screen]::PrimaryScreen; $bounds = $screen.Bounds; $path = "${savePath || 'screenshot_area.png'}"; Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('{PRTSC}'); $WshShell = New-Object -ComObject WScript.Shell; $WshShell.SendKeys('^{ESC}'); $image = [System.Drawing.Bitmap]::FromFile("$env:TEMP\\screenshot.png"); $target = New-Object System.Drawing.Bitmap $width, $height; $graphics = [System.Drawing.Graphics]::FromImage($target); $graphics.CopyFromScreen($x, $y, 0, 0, $target.Size); $target.Save($path, [System.Drawing.Imaging.ImageFormat]::PNG); $graphics.Dispose(); $image.Dispose(); $target.Dispose(); Write-Output "Area screenshot saved to $path"`;

    const process = spawn(scriptPath, ['-Command', command], {
      shell: true,
      windowsHide: true,
    });

    let output = '';
    let errorOutput = '';

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve({
          success: true,
          message: 'Скриншот области сделан',
          output: output.trim(),
        });
      } else {
        reject({
          success: false,
          message: 'Ошибка при создании скриншота области',
          error: errorOutput.trim(),
        });
      }
    });

    process.on('error', (error) => {
      reject({
        success: false,
        message: 'Ошибка процесса',
        error: error.message,
      });
    });
  });
}

/**
 * Делать скриншот конкретного окна
 */
export function takeWindowScreenshot(windowTitle, savePath = null) {
  return new Promise((resolve, reject) => {
    const scriptPath = 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe';
    
    const command = `Add-Type -AssemblyName System.Windows.Forms; $wsh = New-Object -ComObject WScript.Shell; $wsh.SendKeys('^!{PrintScreen}'); $WshShell = New-Object -ComObject WScript.Shell; $WshShell.SendKeys('^{ESC}'); Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('{PRTSC}'); $WshShell = New-Object -ComObject WScript.Shell; $WshShell.SendKeys('^{ESC}'); $image = [System.Drawing.Bitmap]::FromFile("$env:TEMP\\screenshot.png"); $path = "${savePath || 'screenshot_window.png'}"; Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('{PRTSC}'); $WshShell = New-Object -ComObject WScript.Shell; $WshShell.SendKeys('^{ESC}'); $graphics = [System.Drawing.Graphics]::FromImage($image); $bitmap = New-Object System.Drawing.Bitmap $image.Width, $image.Height; $graphics.CopyFromScreen(0, 0, 0, 0, $image.Size); $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::PNG); $graphics.Dispose(); $image.Dispose(); $bitmap.Dispose(); Write-Output "Window screenshot saved to $path"`;

    const process = spawn(scriptPath, ['-Command', command], {
      shell: true,
      windowsHide: true,
    });

    let output = '';
    let errorOutput = '';

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve({
          success: true,
          message: 'Скриншот окна сделан',
          output: output.trim(),
        });
      } else {
        reject({
          success: false,
          message: 'Ошибка при создании скриншота окна',
          error: errorOutput.trim(),
        });
      }
    });

    process.on('error', (error) => {
      reject({
        success: false,
        message: 'Ошибка процесса',
        error: error.message,
      });
    });
  });
}

/**
 * Автоматически делать скриншот при событии
 */
export function takeScreenshotOnEvent(eventType, savePath = null) {
  return new Promise((resolve, reject) => {
    const scriptPath = 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe';
    
    const command = `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('{PRTSC}'); $WshShell = New-Object -ComObject WScript.Shell; $WshShell.SendKeys('^{ESC}'); $path = "${savePath || 'screenshot_event.png'}"; $image = [System.Drawing.Bitmap]::FromFile("$env:TEMP\\screenshot.png"); $image.Save($path, [System.Drawing.Imaging.ImageFormat]::PNG); $image.Dispose(); Write-Output "Screenshot on ${eventType} saved to $path"`;

    const process = spawn(scriptPath, ['-Command', command], {
      shell: true,
      windowsHide: true,
    });

    let output = '';
    let errorOutput = '';

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve({
          success: true,
          message: `Скриншот при событии ${eventType} сделан`,
          output: output.trim(),
        });
      } else {
        reject({
          success: false,
          message: `Ошибка при создании скриншота при событии ${eventType}`,
          error: errorOutput.trim(),
        });
      }
    });

    process.on('error', (error) => {
      reject({
        success: false,
        message: 'Ошибка процесса',
        error: error.message,
      });
    });
  });
}