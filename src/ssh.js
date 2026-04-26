import { spawn } from 'child_process';

/**
 * Подключиться к SSH серверу
 */
export function sshConnect(host, username, options = {}) {
  return new Promise((resolve, reject) => {
    const scriptPath = 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe';
    
    const command = `ssh -o StrictHostKeyChecking=no ${username}@${host} ${options.command || 'pwd'}`;

    const process = spawn('ssh', ['-o', 'StrictHostKeyChecking=no', username, host, options.command || 'pwd'], {
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
          message: 'SSH-соединение установлено',
          output: output.trim(),
        });
      } else {
        reject({
          success: false,
          message: 'Ошибка SSH-соединения',
          error: errorOutput.trim(),
        });
      }
    });

    process.on('error', (error) => {
      reject({
        success: false,
        message: 'Ошибка процесса SSH',
        error: error.message,
      });
    });
  });
}

/**
 * Запустить команду на удалённом сервере
 */
export function sshExecute(host, username, command, options = {}) {
  return new Promise((resolve, reject) => {
    const scriptPath = 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe';
    
    const fullCommand = `ssh -o StrictHostKeyChecking=no ${username}@${host} "${command}"`;

    const process = spawn('ssh', ['-o', 'StrictHostKeyChecking=no', username, host, command], {
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
          message: 'Команда выполнена на удалённом сервере',
          output: output.trim(),
        });
      } else {
        reject({
          success: false,
          message: 'Ошибка выполнения команды',
          error: errorOutput.trim(),
        });
      }
    });

    process.on('error', (error) => {
      reject({
        success: false,
        message: 'Ошибка процесса SSH',
        error: error.message,
      });
    });
  });
}

/**
 * Получить список файлов на удалённом сервере
 */
export function sshListFiles(host, username, path = '.', options = {}) {
  return new Promise((resolve, reject) => {
    const command = `ssh -o StrictHostKeyChecking=no ${username}@${host} "ls -la ${path}"`;

    const process = spawn('ssh', ['-o', 'StrictHostKeyChecking=no', username, host, `ls -la ${path}`], {
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
          message: 'Список файлов получен',
          output: output.trim(),
        });
      } else {
        reject({
          success: false,
          message: 'Ошибка при получении списка файлов',
          error: errorOutput.trim(),
        });
      }
    });

    process.on('error', (error) => {
      reject({
        success: false,
        message: 'Ошибка процесса SSH',
        error: error.message,
      });
    });
  });
}

/**
 * Создать файл на удалённом сервере
 */
export function sshCreateFile(host, username, remotePath, content, options = {}) {
  return new Promise((resolve, reject) => {
    const scriptPath = 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe';
    
    const command = `ssh -o StrictHostKeyChecking=no ${username}@${host} "echo '${content.replace(/'/g, '\\'')}' > ${remotePath}"`;

    const process = spawn('ssh', ['-o', 'StrictHostKeyChecking=no', username, host, `echo '${content.replace(/'/g, '\\'')}' > ${remotePath}`], {
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
          message: `Файл создан на удалённом сервере: ${remotePath}`,
          output: output.trim(),
        });
      } else {
        reject({
          success: false,
          message: 'Ошибка при создании файла',
          error: errorOutput.trim(),
        });
      }
    });

    process.on('error', (error) => {
      reject({
        success: false,
        message: 'Ошибка процесса SSH',
        error: error.message,
      });
    });
  });
}

/**
 * Удалить файл на удалённом сервере
 */
export function sshDeleteFile(host, username, remotePath, options = {}) {
  return new Promise((resolve, reject) => {
    const command = `ssh -o StrictHostKeyChecking=no ${username}@${host} "rm ${remotePath}"`;

    const process = spawn('ssh', ['-o', 'StrictHostKeyChecking=no', username, host, `rm ${remotePath}`], {
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
          message: `Файл удалён с удалённого сервера: ${remotePath}`,
          output: output.trim(),
        });
      } else {
        reject({
          success: false,
          message: 'Ошибка при удалении файла',
          error: errorOutput.trim(),
        });
      }
    });

    process.on('error', (error) => {
      reject({
        success: false,
        message: 'Ошибка процесса SSH',
        error: error.message,
      });
    });
  });
}

/**
 * Получить информацию о удалённом сервере
 */
export function sshGetServerInfo(host, username, options = {}) {
  return new Promise((resolve, reject) => {
    const command = `ssh -o StrictHostKeyChecking=no ${username}@${host} "uname -a && df -h && free -h"`;

    const process = spawn('ssh', ['-o', 'StrictHostKeyChecking=no', username, host, `uname -a && df -h && free -h`], {
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
          message: 'Информация о сервере получена',
          output: output.trim(),
        });
      } else {
        reject({
          success: false,
          message: 'Ошибка при получении информации о сервере',
          error: errorOutput.trim(),
        });
      }
    });

    process.on('error', (error) => {
      reject({
        success: false,
        message: 'Ошибка процесса SSH',
        error: error.message,
      });
    });
  });
}

/**
 * Остановить SSH-соединение
 */
export function sshDisconnect(host, username, options = {}) {
  return new Promise((resolve, reject) => {
    const command = `ssh -o StrictHostKeyChecking=no ${username}@${host} "exit"`;

    const process = spawn('ssh', ['-o', 'StrictHostKeyChecking=no', username, host, 'exit'], {
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
      resolve({
        success: true,
        message: 'SSH-соединение закрыто',
        output: output.trim(),
      });
    });

    process.on('error', (error) => {
      reject({
        success: false,
        message: 'Ошибка при закрытии SSH-соединения',
        error: error.message,
      });
    });
  });
}