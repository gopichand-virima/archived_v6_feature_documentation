# ─── Dockerfile ───────────────────────────────────────────────────────────────
#
# Production deployment: AWS EKS via Helm + ArgoCD (ci-cd.yml → ECR → faas-apps).
# Also usable for local smoke-testing:
#   docker compose up --build
#   Open: http://localhost:8080/
#
# ─── Build stage ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --shamefully-hoist

COPY . .
RUN pnpm build

# ─── Runtime stage ───────────────────────────────────────────────────────────
# nginxinc/nginx-unprivileged runs as non-root user (uid 101) on port 8080.
# No chmod 777 hacks or USER root directives needed.
FROM nginxinc/nginx-unprivileged:alpine

# Copy static build output from build stage.
# nginx root is /usr/share/nginx/html; Vite base '/' means all assets resolve from root.
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration (SPA routing at /)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Port 8080 — unprivileged nginx listens here (non-root cannot bind <1024)
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
