/**
 * Chat Export Utilities
 * Export conversations in various formats
 */

import { Conversation } from "./conversation-service";

/**
 * Export conversation as Markdown
 */
export function exportAsMarkdown(conversation: Conversation): void {
  let markdown = `# ${conversation.title}\n\n`;
  markdown += `**Created:** ${conversation.createdAt.toLocaleString()}\n`;
  markdown += `**Last Updated:** ${conversation.updatedAt.toLocaleString()}\n`;
  markdown += `**Messages:** ${conversation.messages.length}\n\n`;
  markdown += `---\n\n`;

  conversation.messages.forEach((message, index) => {
    const role = message.role === "user" ? "You" : "Virima Assistant";
    markdown += `### ${role}\n`;
    markdown += `*${message.timestamp.toLocaleString()}*\n\n`;
    markdown += `${message.content}\n\n`;

    if (message.sources && message.sources.length > 0) {
      markdown += `**Sources:**\n`;
      message.sources.forEach((source) => {
        markdown += `- [${source.title}](${source.url}) (${source.type})\n`;
      });
      markdown += `\n`;
    }

    if (index < conversation.messages.length - 1) {
      markdown += `---\n\n`;
    }
  });

  downloadFile(
    markdown,
    `${sanitizeFilename(conversation.title)}.md`,
    "text/markdown"
  );
}

/**
 * Export conversation as HTML
 */
export function exportAsHTML(conversation: Conversation): void {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(conversation.title)}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
        }
        .header {
            background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
        }
        .header .meta {
            opacity: 0.9;
            font-size: 14px;
        }
        .message {
            background: white;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .message.user {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            margin-left: 40px;
        }
        .message.assistant {
            margin-right: 40px;
        }
        .message-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        .message.user .message-header {
            border-bottom-color: rgba(255,255,255,0.2);
        }
        .role {
            font-weight: 600;
        }
        .timestamp {
            font-size: 12px;
            opacity: 0.7;
        }
        .content {
            white-space: pre-wrap;
        }
        .sources {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid rgba(0,0,0,0.1);
        }
        .message.user .sources {
            border-top-color: rgba(255,255,255,0.2);
        }
        .sources-title {
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 8px;
        }
        .source {
            display: flex;
            align-items: start;
            gap: 8px;
            padding: 8px;
            background: rgba(0,0,0,0.05);
            border-radius: 6px;
            margin-bottom: 6px;
            text-decoration: none;
            color: inherit;
        }
        .message.user .source {
            background: rgba(255,255,255,0.2);
        }
        .source:hover {
            background: rgba(0,0,0,0.1);
        }
        .message.user .source:hover {
            background: rgba(255,255,255,0.3);
        }
        .source-badge {
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 600;
        }
        .source-badge.doc {
            background: #10b981;
            color: white;
        }
        .source-badge.web {
            background: #3b82f6;
            color: white;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${escapeHtml(conversation.title)}</h1>
        <div class="meta">
            <div>Created: ${conversation.createdAt.toLocaleString()}</div>
            <div>Last Updated: ${conversation.updatedAt.toLocaleString()}</div>
            <div>Messages: ${conversation.messages.length}</div>
        </div>
    </div>

    ${conversation.messages
      .map(
        (message) => `
    <div class="message ${message.role}">
        <div class="message-header">
            <span class="role">${message.role === "user" ? "You" : "Virima Assistant"}</span>
            <span class="timestamp">${message.timestamp.toLocaleString()}</span>
        </div>
        <div class="content">${escapeHtml(message.content)}</div>
        ${
          message.sources && message.sources.length > 0
            ? `
        <div class="sources">
            <div class="sources-title">Sources:</div>
            ${message.sources
              .map(
                (source) => `
            <a href="${escapeHtml(source.url)}" class="source" target="_blank" rel="noopener noreferrer">
                <span class="source-badge ${source.type}">${source.type.toUpperCase()}</span>
                <div>
                    <div style="font-weight: 500; font-size: 14px;">${escapeHtml(source.title)}</div>
                    <div style="font-size: 12px; opacity: 0.8;">${escapeHtml(source.snippet)}</div>
                </div>
            </a>
            `
              )
              .join("")}
        </div>
        `
            : ""
        }
    </div>
    `
      )
      .join("")}

    <div class="footer">
        Exported from Virima Documentation Assistant
        <br>
        ${new Date().toLocaleString()}
    </div>
</body>
</html>
  `.trim();

  downloadFile(
    html,
    `${sanitizeFilename(conversation.title)}.html`,
    "text/html"
  );
}

/**
 * Export conversation as plain text
 */
export function exportAsText(conversation: Conversation): void {
  let text = `${conversation.title}\n`;
  text += `${"=".repeat(conversation.title.length)}\n\n`;
  text += `Created: ${conversation.createdAt.toLocaleString()}\n`;
  text += `Last Updated: ${conversation.updatedAt.toLocaleString()}\n`;
  text += `Messages: ${conversation.messages.length}\n\n`;
  text += `${"-".repeat(60)}\n\n`;

  conversation.messages.forEach((message, index) => {
    const role = message.role === "user" ? "You" : "Virima Assistant";
    text += `${role} (${message.timestamp.toLocaleString()}):\n`;
    text += `${message.content}\n`;

    if (message.sources && message.sources.length > 0) {
      text += `\nSources:\n`;
      message.sources.forEach((source) => {
        text += `  - ${source.title} (${source.type})\n`;
        text += `    ${source.url}\n`;
      });
    }

    if (index < conversation.messages.length - 1) {
      text += `\n${"-".repeat(60)}\n\n`;
    }
  });

  text += `\n${"=".repeat(60)}\n`;
  text += `Exported from Virima Documentation Assistant\n`;
  text += `${new Date().toLocaleString()}\n`;

  downloadFile(
    text,
    `${sanitizeFilename(conversation.title)}.txt`,
    "text/plain"
  );
}

/**
 * Helper function to download a file
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Sanitize filename
 */
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase()
    .substring(0, 50);
}

/**
 * Escape HTML characters
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&",
    "<": "<",
    ">": ">",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
