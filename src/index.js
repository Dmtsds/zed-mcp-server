import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import {
  openBrowser,
  openBrowserWithArgs,
  openMultipleBrowsers,
} from './browser.js';
import {
  takeScreenshot,
  takeAreaScreenshot,
  takeWindowScreenshot,
  takeScreenshotOnEvent,
} from './screenshot.js';
import {
  sshConnect,
  sshExecute,
  sshListFiles,
  sshCreateFile,
  sshDeleteFile,
  sshGetServerInfo,
  sshDisconnect,
} from './ssh.js';

// Создание сервера MCP
const server = new Server(
  {
    name: 'zed-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Регистрация инструментов
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'open_browser',
        description: 'Открыть URL в браузере',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'URL для открытия',
            },
          },
          required: ['url'],
        },
      },
      {
        name: 'open_browser_with_args',
        description: 'Открыть URL в браузере с параметрами',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'URL для открытия',
            },
            args: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Аргументы для браузера',
              default: [],
            },
          },
          required: ['url'],
        },
      },
      {
        name: 'open_multiple_browsers',
        description: 'Открыть несколько URL в разных вкладках',
        inputSchema: {
          type: 'object',
          properties: {
            urls: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Список URL для открытия',
            },
          },
          required: ['urls'],
        },
      },
      {
        name: 'take_screenshot',
        description: 'Делать скриншот всего экрана',
        inputSchema: {
          type: 'object',
          properties: {
            save_path: {
              type: 'string',
              description: 'Путь для сохранения скриншота',
            },
          },
          required: false,
        },
      },
      {
        name: 'take_area_screenshot',
        description: 'Делать скриншот области экрана',
        inputSchema: {
          type: 'object',
          properties: {
            x: {
              type: 'number',
              description: 'X-координата левого верхнего угла',
            },
            y: {
              type: 'number',
              description: 'Y-координата левого верхнего угла',
            },
            width: {
              type: 'number',
              description: 'Ширина области',
            },
            height: {
              type: 'number',
              description: 'Высота области',
            },
            save_path: {
              type: 'string',
              description: 'Путь для сохранения скриншота',
            },
          },
          required: ['x', 'y', 'width', 'height'],
        },
      },
      {
        name: 'take_window_screenshot',
        description: 'Делать скриншот конкретного окна',
        inputSchema: {
          type: 'object',
          properties: {
            window_title: {
              type: 'string',
              description: 'Заголовок окна',
            },
            save_path: {
              type: 'string',
              description: 'Путь для сохранения скриншота',
            },
          },
          required: ['window_title'],
        },
      },
      {
        name: 'take_screenshot_on_event',
        description: 'Автоматически сделать скриншот при событии',
        inputSchema: {
          type: 'object',
          properties: {
            event_type: {
              type: 'string',
              description: 'Тип событие',
            },
            save_path: {
              type: 'string',
              description: 'Путь для сохранения скриншота',
            },
          },
          required: ['event_type'],
        },
      },
      {
        name: 'ssh_connect',
        description: 'Подключиться к SSH серверу',
        inputSchema: {
          type: 'object',
          properties: {
            host: {
              type: 'string',
              description: 'Адрес сервера',
            },
            username: {
              type: 'string',
              description: 'Имя пользователя',
            },
            command: {
              type: 'string',
              description: 'Команда для выполнения',
            },
          },
          required: ['host', 'username'],
        },
      },
      {
        name: 'ssh_execute',
        description: 'Запустить команду на удалённом сервере',
        inputSchema: {
          type: 'object',
          properties: {
            host: {
              type: 'string',
              description: 'Адрес сервера',
            },
            username: {
              type: 'string',
              description: 'Имя пользователя',
            },
            command: {
              type: 'string',
              description: 'Команда для выполнения',
            },
          },
          required: ['host', 'username', 'command'],
        },
      },
      {
        name: 'ssh_list_files',
        description: 'Получить список файлов на удалённом сервере',
        inputSchema: {
          type: 'object',
          properties: {
            host: {
              type: 'string',
              description: 'Адрес сервера',
            },
            username: {
              type: 'string',
              description: 'Имя пользователя',
            },
            path: {
              type: 'string',
              description: 'Путь к директории',
            },
          },
          required: ['host', 'username'],
        },
      },
      {
        name: 'ssh_create_file',
        description: 'Создать файл на удалённом сервере',
        inputSchema: {
          type: 'object',
          properties: {
            host: {
              type: 'string',
              description: 'Адрес сервера',
            },
            username: {
              type: 'string',
              description: 'Имя пользователя',
            },
            remote_path: {
              type: 'string',
              description: 'Путь к файлу на удалённом сервере',
            },
            content: {
              type: 'string',
              description: 'Содержимое файла',
            },
          },
          required: ['host', 'username', 'remote_path', 'content'],
        },
      },
      {
        name: 'ssh_delete_file',
        description: 'Удалить файл на удалённом сервере',
        inputSchema: {
          type: 'object',
          properties: {
            host: {
              type: 'string',
              description: 'Адрес сервера',
            },
            username: {
              type: 'string',
              description: 'Имя пользователя',
            },
            remote_path: {
              type: 'string',
              description: 'Путь к файлу на удалённом сервере',
            },
          },
          required: ['host', 'username', 'remote_path'],
        },
      },
      {
        name: 'ssh_get_server_info',
        description: 'Получить информацию о удалённом сервере',
        inputSchema: {
          type: 'object',
          properties: {
            host: {
              type: 'string',
              description: 'Адрес сервера',
            },
            username: {
              type: 'string',
              description: 'Имя пользователя',
            },
          },
          required: ['host', 'username'],
        },
      },
      {
        name: 'ssh_disconnect',
        description: 'Остановить SSH-соединение',
        inputSchema: {
          type: 'object',
          properties: {
            host: {
              type: 'string',
              description: 'Адрес сервера',
            },
            username: {
              type: 'string',
              description: 'Имя пользователя',
            },
          },
          required: ['host', 'username'],
        },
      },
    ],
  };
});

// Обработка запросов на выполнение инструментов
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'open_browser': {
        const { url } = args;
        const result = await openBrowser(url);
        
        if (result.success) {
          return {
            content: [{
              type: 'text',
              text: result.message,
            }],
          };
        } else {
          return {
            content: [{
              type: 'text',
              text: `Ошибка: ${result.message}`,
            }],
            isError: true,
          };
        }
      }

      case 'open_browser_with_args': {
        const { url, args = [] } = args;
        const result = await openBrowserWithArgs(url, args);
        
        if (result.success) {
          return {
            content: [{
              type: 'text',
              text: result.message,
            }],
          };
        } else {
          return {
            content: [{
              type: 'text',
              text: `Ошибка: ${result.message}`,
            }],
            isError: true,
          };
        }
      }

      case 'open_multiple_browsers': {
        const { urls } = args;
        const result = await openMultipleBrowsers(urls);
        
        if (result.success) {
          return {
            content: [{
              type: 'text',
              text: result.message,
            }],
          };
        } else {
          return {
            content: [{
              type: 'text',
              text: `Ошибка: ${result.message}`,
            }],
            isError: true,
          };
        }
      }

      case 'take_screenshot': {
        const { save_path } = args;
        const result = await takeScreenshot(save_path);
        
        if (result.success) {
          return {
            content: [{
              type: 'text',
              text: result.message,
            }],
          };
        } else {
          return {
            content: [{
              type: 'text',
              text: `Ошибка: ${result.message}`,
            }],
            isError: true,
          };
        }
      }

      case 'take_area_screenshot': {
        const { x, y, width, height, save_path } = args;
        const result = await takeAreaScreenshot(x, y, width, height, save_path);
        
        if (result.success) {
          return {
            content: [{
              type: 'text',
              text: result.message,
            }],
          };
        } else {
          return {
            content: [{
              type: 'text',
              text: `Ошибка: ${result.message}`,
            }],
            isError: true,
          };
        }
      }

      case 'take_window_screenshot': {
        const { window_title, save_path } = args;
        const result = await takeWindowScreenshot(window_title, save_path);
        
        if (result.success) {
          return {
            content: [{
              type: 'text',
              text: result.message,
            }],
          };
        } else {
          return {
            content: [{
              type: 'text',
              text: `Ошибка: ${result.message}`,
            }],
            isError: true,
          };
        }
      }

      case 'take_screenshot_on_event': {
        const { event_type, save_path } = args;
        const result = await takeScreenshotOnEvent(event_type, save_path);
        
        if (result.success) {
          return {
            content: [{
              type: 'text',
              text: result.message,
            }],
          };
        } else {
          return {
            content: [{
              type: 'text',
              text: `Ошибка: ${result.message}`,
            }],
            isError: true,
          };
        }
      }

      case 'ssh_connect': {
        const { host, username, command } = args;
        const result = await sshConnect(host, username, { command });
        
        if (result.success) {
          return {
            content: [{
              type: 'text',
              text: result.message,
            }],
          };
        } else {
          return {
            content: [{
              type: 'text',
              text: `Ошибка: ${result.message}`,
            }],
            isError: true,
          };
        }
      }

      case 'ssh_execute': {
        const { host, username, command } = args;
        const result = await sshExecute(host, username, command);
        
        if (result.success) {
          return {
            content: [{
              type: 'text',
              text: result.message,
            }],
          };
        } else {
          return {
            content: [{
              type: 'text',
              text: `Ошибка: ${result.message}`,
            }],
            isError: true,
          };
        }
      }

      case 'ssh_list_files': {
        const { host, username, path } = args;
        const result = await sshListFiles(host, username, path);
        
        if (result.success) {
          return {
            content: [{
              type: 'text',
              text: result.message,
            }],
          };
        } else {
          return {
            content: [{
              type: 'text',
              text: `Ошибка: ${result.message}`,
            }],
            isError: true,
          };
        }
      }

      case 'ssh_create_file': {
        const { host, username, remote_path, content } = args;
        const result = await sshCreateFile(host, username, remote_path, content);
        
        if (result.success) {
          return {
            content: [{
              type: 'text',
              text: result.message,
            }],
          };
        } else {
          return {
            content: [{
              type: 'text',
              text: `Ошибка: ${result.message}`,
            }],
            isError: true,
          };
        }
      }

      case 'ssh_delete_file': {
        const { host, username, remote_path } = args;
        const result = await sshDeleteFile(host, username, remote_path);
        
        if (result.success) {
          return {
            content: [{
              type: 'text',
              text: result.message,
            }],
          };
        } else {
          return {
            content: [{
              type: 'text',
              text: `Ошибка: ${result.message}`,
            }],
            isError: true,
          };
        }
      }

      case 'ssh_get_server_info': {
        const { host, username } = args;
        const result = await sshGetServerInfo(host, username);
        
        if (result.success) {
          return {
            content: [{
              type: 'text',
              text: result.message,
            }],
          };
        } else {
          return {
            content: [{
              type: 'text',
              text: `Ошибка: ${result.message}`,
            }],
            isError: true,
          };
        }
      }

      case 'ssh_disconnect': {
        const { host, username } = args;
        const result = await sshDisconnect(host, username);
        
        if (result.success) {
          return {
            content: [{
              type: 'text',
              text: result.message,
            }],
          };
        } else {
          return {
            content: [{
              type: 'text',
              text: `Ошибка: ${result.message}`,
            }],
            isError: true,
          };
        }
      }

      default:
        return {
          content: [{
            type: 'text',
            text: `Неизвестный инструмент: ${name}`,
          }],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Ошибка при выполнении: ${error.message}`,
      }],
      isError: true,
    };
  }
});

// Запуск сервера
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Zed MCP Server is running');
}

main().catch(console.error);