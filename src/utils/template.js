import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// テンプレートキャッシュ
const templateCache = new Map();

/**
 * テンプレートをレンダリング
 * @param {string} templateName - テンプレート名（拡張子なし）
 * @param {object} variables - テンプレート変数
 * @returns {string} - レンダリング済み HTML
 */
export function renderTemplate(templateName, variables = {}) {
  const templatePath = path.join(__dirname, '../../templates', `${templateName}.html`);

  // キャッシュからテンプレートを取得、なければ読み込み
  let template = templateCache.get(templatePath);
  if (!template) {
    template = fs.readFileSync(templatePath, 'utf-8');
    templateCache.set(templatePath, template);
  }

  // 変数を置換
  let html = template;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, value ?? '');
  }

  return html;
}
