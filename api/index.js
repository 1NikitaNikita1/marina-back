
const axios = require('axios');
const dotenv = require('dotenv');
const { google } = require('googleapis');

dotenv.config();

const TELEGRAM_BOT_TOKEN =
    process.env.TELEGRAM_BOT_TOKEN ||
    '8005182169:AAFoj9A8p8AM7FrAFSojgrZFs65e2DZj8M0';

const CHAT_ID =
    process.env.TELEGRAM_CHAT_ID || '-1002592836903';

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID || '1doUMkfT5QlRAdg9AMSiOzroenGT8xFfP4dqwZg_weGI';
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL || 'forms-sheets-writer@alert-port-512713-k3.iam.gserviceaccount.com';
const GOOGLE_PRIVATE_KEY = (process.env.GOOGLE_PRIVATE_KEY || '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDXWrhdM0GdL+wY\nTRROOBbmYrPQSc2Qr1D75lIM1qzztQyr6g4OkBz7Dvm1noZTMZ4cjO4VBLg3G4P6\n5I4HD7ZVUbmLJ8/qrxxliFQBGFZUchzn+TinFXB6GRmty4gw2K3I/EFJzK1FXi1M\nZj6ug+SctsKq0HhSLD2RjF6kxUUZD3N/qyPKv1/DaQwWpijK6XakouLlpLSQn6IN\nE5uPFeoezHxqMPb2XrPV2OA+b60VdrmrE9O3m8NKnFzXMWl701SGt14+IHWOfMEA\ngwUF7hwEX1hKZbA73WBr1nuYx78QaZPVhR4sPALei9TUsmB4yPS7bzDZqBhFRiYf\navl3NvXRAgMBAAECggEAAmJmEFK4upCTzmM6Phix9l35Pp6YuV9MeT7AHzMw+fPz\nJKjAhgOtY2PCXWkdiGOoyX9eRGIT1yVH/87BZpTsB9Ab6Fc2RgmdiKRoTzxVNUlg\n7aGCO3RHZCUmOxjrG8xENdrG/fhrLD7A7JCgArwGpWwCwSVA+t141uLcmReCrBy5\nUcR9WWPiMKStM8nPDsTse4LGikCa/9HuD+Yt0bWdmtk5PXWnlx3kHCYMMxEYyPqK\no/s2YkS5qPHeUSR4y4zLopGwav/M37Z6eAiFFhZp0C8TAzm6ZXfYiLt+KBAVAaEz\n1lFVFstMDok6Gw4UqutpImV1XRy/h7nIBgo0R82YsQKBgQD6Lwav4C8aGMPBMcBT\nE3KscQNUtr2ICtG5Su66rbq+KuvYybJFO+ruNNNSpyR9iIF5+eMtwGjnO3gOFYLw\nrHlkZWjcQbase3+L87m2DsvlK0kT3khlsrT12K7Pkx/y3YPQr/okiJhNLw9SpwzW\n87NeXi5zKg8qaply8K1XFWFTZQKBgQDcXGgVBvonI7tNY8SCK2hKVVHrqpq+aAD4\nv8eDC/JAOXC97XhvSrcF9gTcQMeBpVlcw2XR7HC770jTU1sD3H7IDaAQd0ZcHvf8\nnFq65iiSlVx10VMvvB7V5QXsY6JfZIPRDFNORH2NCUUU9C6vkXx6ga5bkWEtMRVF\ny4XASVgv/QKBgQDnRK1jy1L/RsE+R+VHZoTszxOLLdoKdiXkqVYBjzM/M6INJnX6\n9iZ3yLFIiGV8/cDippLQ6jqO9jRGoLAIFweoPO4wHTbmPstq7gRQPWFSGS9WhHZc\nPFR3prQCAjjYYtjFAsezGenf/46kkvOViHXY2CsMHmciiKQM0lsKUyNC2QKBgCfX\nSTYsCcRT0ISAekHyqStvW51ZPhsY4LwYqHDIEyeLexfLvI+amZapUV2lFK0bARol\ndd5LemJwM+GJW5ZKIl33IK55ci4rpzhz6G+MN1+xQ4NFsl2aDJUtkDGaHfxTRwXf\nzZwEBBMgzu2n7Fzv1+qqUaTalxA9pJP25RrL5/bdAoGBAOMaxoP5erX8r47Iifxw\nqOdZ8PS64hg5aOo6kmooY3vbaxZTbIbuxWSCIMPrKAx6UOglGhWrMxjujq+1c2q5\nGHn6xcUUz2C3itkcpLW6aGIniblE98B/3Xi79hzkd8Wk1qjbmW/dr/mcoYyQ6LuO\nnAkq3pWZo5bEb8N3em/9DJvk\n-----END PRIVATE KEY-----\n')?.replace(/\\n/g, '\n');


const MONTH_NAMES = [
    'Січень',
    'Лютий',
    'Березень',
    'Квітень',
    'Травень',
    'Червень',
    'Липень',
    'Серпень',
    'Вересень',
    'Жовтень',
    'Листопад',
    'Грудень'
];

const SHEET_HEADERS = [
    'Source сторінка:',
    'Ім’я:',
    'Телефон:',
    'Telegram:',
    'Instagram:',
    'Запит:',
    'Етап:',
    'Середній місячний дохід:',
    'Повідомлення:',
    'Час:',
    'Статус'
];

const sheetsAuth =
    GOOGLE_SHEET_ID && GOOGLE_CLIENT_EMAIL && GOOGLE_PRIVATE_KEY
        ? new google.auth.JWT({
            email: GOOGLE_CLIENT_EMAIL,
            key: GOOGLE_PRIVATE_KEY,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        })
        : null;

const sheets = sheetsAuth
    ? google.sheets({ version: 'v4', auth: sheetsAuth })
    : null;

async function sendTelegramMessage(message) {
    const telegramAPI =
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const response = await axios.post(telegramAPI, {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
    });

    return response.data;
}

function getKyivDateParts(date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Kyiv',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    }).formatToParts(date);

    const values = Object.fromEntries(
        parts.map(({ type, value }) => [type, value])
    );

    return {
        year: Number(values.year),
        month: Number(values.month),
        day: Number(values.day)
    };
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}

async function copyStatusValidation(sheetId, allSheets) {
    const template = allSheets.find(
        item => item.properties.sheetId !== sheetId
    );

    if (!template) return;

    await sheets.spreadsheets.batchUpdate({
        spreadsheetId: GOOGLE_SHEET_ID,
        requestBody: {
            requests: [
                {
                    copyPaste: {
                        source: {
                            sheetId: template.properties.sheetId,
                            startRowIndex: 1,
                            endRowIndex: 1000,
                            startColumnIndex: 10,
                            endColumnIndex: 11
                        },
                        destination: {
                            sheetId,
                            startRowIndex: 1,
                            endRowIndex: 1000,
                            startColumnIndex: 10,
                            endColumnIndex: 11
                        },
                        pasteType: 'PASTE_DATA_VALIDATION',
                        pasteOrientation: 'NORMAL'
                    }
                }
            ]
        }
    });
}

async function ensureStatusColumn(sheetId, allSheets, sheetTitle) {
    const sheet = allSheets.find(
        item => item.properties.sheetId === sheetId
    );

    const columnCount = sheet?.properties?.gridProperties?.columnCount || 0;

    const requests = [];

    if (columnCount < 11) {
        requests.push({
            updateSheetProperties: {
                properties: {
                    sheetId,
                    gridProperties: {
                        columnCount: 11
                    }
                },
                fields: 'gridProperties.columnCount'
            }
        });
    }

    requests.push({
        repeatCell: {
            range: {
                sheetId,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 10,
                endColumnIndex: 11
            },
            cell: {
                userEnteredFormat: {
                    backgroundColor: {
                        red: 0.82,
                        green: 0.9,
                        blue: 0.8
                    },
                    textFormat: {
                        bold: true,
                        fontSize: 12
                    },
                    horizontalAlignment: 'CENTER',
                    verticalAlignment: 'MIDDLE',
                    wrapStrategy: 'WRAP'
                }
            },
            fields: 'userEnteredFormat'
        }
    });

    await sheets.spreadsheets.values.update({
        spreadsheetId: GOOGLE_SHEET_ID,
        range: `'${sheetTitle}'!K1`,
        valueInputOption: 'RAW',
        requestBody: {
            values: [['Статус']]
        }
    });

    await sheets.spreadsheets.batchUpdate({
        spreadsheetId: GOOGLE_SHEET_ID,
        requestBody: { requests }
    });

    await copyStatusValidation(sheetId, allSheets);
}

async function getOrCreateMonthlySheet(sheetTitle) {
    const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId: GOOGLE_SHEET_ID
    });

    const existingSheet = spreadsheet.data.sheets.find(
        sheet => sheet.properties.title === sheetTitle
    );

    if (existingSheet) {
        await ensureStatusColumn(
            existingSheet.properties.sheetId,
            spreadsheet.data.sheets,
            sheetTitle
        );

        return existingSheet.properties;
    }

    const result = await sheets.spreadsheets.batchUpdate({
        spreadsheetId: GOOGLE_SHEET_ID,
        requestBody: {
            requests: [
                {
                    addSheet: {
                        properties: {
                            title: sheetTitle,
                            gridProperties: {
                                frozenRowCount: 1,
                                rowCount: 1000,
                                columnCount: 11
                            }
                        }
                    }
                }
            ]
        }
    });

    const newSheet = result.data.replies[0].addSheet.properties;

    await sheets.spreadsheets.values.update({
        spreadsheetId: GOOGLE_SHEET_ID,
        range: `'${sheetTitle}'!A1:K1`,
        valueInputOption: 'RAW',
        requestBody: {
            values: [SHEET_HEADERS]
        }
    });

    const requests = [
        {
            repeatCell: {
                range: {
                    sheetId: newSheet.sheetId,
                    startRowIndex: 0,
                    endRowIndex: 1,
                    startColumnIndex: 0,
                    endColumnIndex: 10
                },
                cell: {
                    userEnteredFormat: {
                        backgroundColor: {
                            red: 1,
                            green: 0.95,
                            blue: 0.78
                        },
                        textFormat: {
                            bold: true,
                            fontSize: 12
                        },
                        horizontalAlignment: 'CENTER',
                        verticalAlignment: 'MIDDLE',
                        wrapStrategy: 'WRAP'
                    }
                },
                fields: 'userEnteredFormat'
            }
        },
        {
            repeatCell: {
                range: {
                    sheetId: newSheet.sheetId,
                    startRowIndex: 0,
                    endRowIndex: 1,
                    startColumnIndex: 10,
                    endColumnIndex: 11
                },
                cell: {
                    userEnteredFormat: {
                        backgroundColor: {
                            red: 0.82,
                            green: 0.9,
                            blue: 0.8
                        },
                        textFormat: {
                            bold: true,
                            fontSize: 12
                        },
                        horizontalAlignment: 'CENTER',
                        verticalAlignment: 'MIDDLE',
                        wrapStrategy: 'WRAP'
                    }
                },
                fields: 'userEnteredFormat'
            }
        },
        {
            updateDimensionProperties: {
                range: {
                    sheetId: newSheet.sheetId,
                    dimension: 'ROWS',
                    startIndex: 0,
                    endIndex: 1
                },
                properties: {
                    pixelSize: 58
                },
                fields: 'pixelSize'
            }
        },
        ...Array.from({ length: 11 }, (_, index) => ({
            updateDimensionProperties: {
                range: {
                    sheetId: newSheet.sheetId,
                    dimension: 'COLUMNS',
                    startIndex: index,
                    endIndex: index + 1
                },
                properties: {
                    pixelSize:
                        index === 7 || index === 8
                            ? 180
                            : index === 9
                                ? 220
                                : index === 10
                                    ? 180
                                    : 150
                },
                fields: 'pixelSize'
            }
        }))
    ];

    await sheets.spreadsheets.batchUpdate({
        spreadsheetId: GOOGLE_SHEET_ID,
        requestBody: { requests }
    });

    await copyStatusValidation(
        newSheet.sheetId,
        spreadsheet.data.sheets
    );

    return newSheet;
}

async function saveToGoogleSheets(data) {
    if (!sheets) {
        throw new Error(
            'Google Sheets is not configured. Check GOOGLE_SHEET_ID, GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY.'
        );
    }

    const now = new Date();
    const { year, month } = getKyivDateParts(now);
    const sheetTitle = `${MONTH_NAMES[month - 1]} ${year}`;

    const monthlySheet = await getOrCreateMonthlySheet(sheetTitle);

    const timestamp = now.toLocaleString('uk-UA', {
        timeZone: 'Europe/Kyiv'
    });

    const columnValues = await sheets.spreadsheets.values.get({
        spreadsheetId: GOOGLE_SHEET_ID,
        range: `'${sheetTitle}'!A:A`
    });

    const nextRow = Math.max(
        2,
        (columnValues.data.values || []).length + 1
    );

    const sheetId = monthlySheet.sheetId;

    await sheets.spreadsheets.batchUpdate({
        spreadsheetId: GOOGLE_SHEET_ID,
        requestBody: {
            requests: [
                {
                    repeatCell: {
                        range: {
                            sheetId,
                            startRowIndex: nextRow - 1,
                            endRowIndex: nextRow,
                            startColumnIndex: 0,
                            endColumnIndex: 10
                        },
                        cell: {
                            userEnteredFormat: {}
                        },
                        fields: 'userEnteredFormat'
                    }
                }
            ]
        }
    });

    await sheets.spreadsheets.values.update({
        spreadsheetId: GOOGLE_SHEET_ID,
        range: `'${sheetTitle}'!A${nextRow}:J${nextRow}`,
        valueInputOption: 'RAW',
        requestBody: {
            values: [[
                data.kind || '',
                data.name || '',
                data.tel || '',
                data.telegram || '',
                data.instagram || '',
                data.request || '',
                data.stage || '',
                data.amount || '',
                data.message || '',
                timestamp
            ]]
        }
    });
}

module.exports = async (req, res) => {
    const allowedOrigins = [
        'https://strategymaryna.com',
        'https://www.strategymaryna.com',
        'https://form.strategymaryna.com',
        'https://training.strategymaryna.com',
        'https://study.strategymaryna.com'
    ];

    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method === 'GET') {
        return res.status(200).json({
            message: 'Telegram Contact API is running',
            status: 'ok',
            timestamp: new Date().toISOString()
        });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed'
        });
    }

    try {
        const {
            name,
            tel,
            telegram,
            instagram,
            message,
            kind,
            request,
            stage,
            amount
        } = req.body || {};

        if (!name || !tel) {
            return res.status(400).json({
                success: false,
                message: 'Необхідно вказати імʼя та телефон'
            });
        }

        let telegramMessage = '<b>Нове повідомлення!</b>\n\n\n';

        if (kind) {
            telegramMessage +=
                `<b>Source сторінка:</b> ${escapeHtml(kind)}\n`;
        }

        telegramMessage += `<b>Імʼя:</b> ${escapeHtml(name)}\n`;

        telegramMessage +=
            `<b>Телефон:</b> <a href="tel:${escapeHtml(tel)}">${escapeHtml(tel)}</a>\n`;

        if (telegram) {
            const username = String(telegram).replace(/^@/, '');

            telegramMessage +=
                `<b>Telegram:</b> <a href="https://t.me/${encodeURIComponent(username)}">@${escapeHtml(username)}</a>\n`;
        }

        if (instagram) {
            const username = String(instagram).replace(/^@/, '');

            telegramMessage +=
                `<b>Instagram:</b> <a href="https://instagram.com/${encodeURIComponent(username)}">@${escapeHtml(username)}</a>\n`;
        }

        if (request) {
            telegramMessage += `<b>Запит:</b> ${escapeHtml(request)}\n`;
        }

        if (stage) {
            telegramMessage += `<b>Етап:</b> ${escapeHtml(stage)}\n`;
        }

        if (amount) {
            telegramMessage +=
                `<b>Середній місячний дохід:</b> ${escapeHtml(amount)}\n`;
        }

        if (message) {
            telegramMessage +=
                `<b>Повідомлення:</b> ${escapeHtml(message)}\n`;
        }

        const timestamp = new Date().toLocaleString('uk-UA', {
            timeZone: 'Europe/Kyiv'
        });

        telegramMessage += `\n<b>Час:</b> ${timestamp}`;

        const data = {
            name,
            tel,
            telegram,
            instagram,
            message,
            kind,
            request,
            stage,
            amount,
            timestamp
        };

        const results = await Promise.allSettled([
            sendTelegramMessage(telegramMessage),
            saveToGoogleSheets(data)
        ]);

        const telegramSuccess = results[0].status === 'fulfilled';
        const sheetsSuccess = results[1].status === 'fulfilled';

        if (!telegramSuccess) {
            console.error(
                'Telegram delivery failed:',
                results[0].reason?.message
            );
        }

        if (!sheetsSuccess) {
            console.error(
                'Google Sheets save failed:',
                results[1].reason?.message
            );
        }

        if (!telegramSuccess && !sheetsSuccess) {
            return res.status(500).json({
                success: false,
                message: 'Не вдалося відправити повідомлення або зберегти дані'
            });
        }

        return res.status(200).json({
            success: true,
            telegram: telegramSuccess,
            googleSheets: sheetsSuccess,
            message: 'Обробку форми завершено'
        });
    } catch (error) {
        console.error('Error processing contact form:', error);

        return res.status(500).json({
            success: false,
            message: 'Помилка сервера',
            error: error.message
        });
    }
};
