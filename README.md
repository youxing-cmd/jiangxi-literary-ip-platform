# 江西文联文学作品影视转化展示平台 MVP

这是一个面向“文学作品展示 + 影视转化成果展示”的前台演示版，并保留一个独立运营系统路由用于本地 demo。

## 已覆盖

- 前台：首页、作品展示、作品详情、转化作品、作品专期、影视专期、作家库、作家详情、政策资讯。
- 独立运营系统 demo：作品管理、作家管理、改编状态录入、改编成绩备注、外部连载链接开关、首页推荐开关。
- 支持标注：全站页脚以弱化方式标注“九州转化平台提供支持｜支持单位：九州文化”。
- 数据：当前版本使用浏览器 `localStorage` 保存，适合快速验收页面和字段。

## 本地运行

```bash
npm install
npm run dev
```

默认维护口令是 `demo-admin`。如需改成本地或部署环境自己的口令，可以参考 `.env.example` 新建 `.env`：

```bash
VITE_ADMIN_PASSCODE=your-passcode
```

## 构建部署

```bash
npm run build
```

构建产物在 `dist/`，可以部署到 Nginx、Vercel、Netlify 或对象存储静态站点。

## GitHub Pages 自动部署

仓库已包含 `.github/workflows/deploy.yml`。推送到 `main` 后，在 GitHub 仓库的 `Settings -> Pages` 中把 `Source` 设置为 `GitHub Actions`，之后每次推送都会自动构建并部署。

其他人获取源码：

```bash
git clone <repository-url>
cd jiangxi-literary-ip-platform
npm install
npm run dev
```

## 正式部署建议

- 展示端：独立域名或主域名，纯展示，不放运营入口。
- 运营端：独立子域名或内网系统，例如 `admin.example.com`，用于登录、数据统计、内容增改和审核发布。
- 数据接口：展示端只读已发布内容；运营端读写草稿、审核、发布、日志和统计数据。

## 后续接真实后台时建议补齐

- 登录、角色权限和操作日志。
- 数据库表：作品、作家、转化项目、专题、影视资源、政策资讯、媒体文件。
- 图片上传：封面、作家头像、专题 Banner、影视海报。
- SEO：作品详情页服务端渲染或静态化。
- 审核流：新增/编辑内容先草稿，再发布到前台。
