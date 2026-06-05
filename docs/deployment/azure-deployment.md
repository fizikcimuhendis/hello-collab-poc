# Azure Container Apps Deployment Guide

This guide covers deploying HelloCollab to Azure Container Apps.

## Prerequisites

- Azure subscription
- Azure CLI installed and authenticated (`az login`)
- Docker installed (for local builds)
- Container registry (Azure Container Registry recommended)

## Architecture

```
┌─────────────────┐
│  Static Web App │ ← Frontend (optional)
└────────┬────────┘
         │
    ┌────▼─────────────────────┐
    │  Container Apps (V1/V2/V3)│
    ├───────────────────────────┤
    │ - App Service Environment │
    │ - Autoscaling (CPU/Memory)│
    │ - HTTPS (managed cert)    │
    └────┬──────────────────┬───┘
         │                  │
    ┌────▼──────────┐  ┌───▼──────────┐
    │ Azure Key     │  │ App Insights │
    │ Vault         │  │ (Monitoring) │
    └───────────────┘  └──────────────┘
```

## Deployment Steps

### 1. Build Docker Image

```bash
# From repository root
docker build -t hello-collab:v3 \
  -f versions/v3-graph-least-privilege/Dockerfile \
  versions/v3-graph-least-privilege
```

**Dockerfile** (placeholder in v3-graph-least-privilege/):

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy monorepo package files
COPY package*.json ./
COPY shared/ ./shared/
COPY versions/v3-graph-least-privilege/ ./app/

# Install dependencies
RUN npm install --production

# Build shared library
RUN npm run build -w shared

# Build app
WORKDIR /app/app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### 2. Push to Container Registry

```bash
# Create registry (if not exists)
az acr create \
  --resource-group hello-collab-rg \
  --name hellocollab \
  --sku Basic

# Login to registry
az acr login --name hellocollab

# Tag and push image
docker tag hello-collab:v3 \
  hellocollab.azurecr.io/hello-collab:v3

docker push hellocollab.azurecr.io/hello-collab:v3
```

### 3. Create Container App

```bash
# Create resource group
az group create \
  --name hello-collab-rg \
  --location eastus

# Create Container Apps Environment
az containerapp env create \
  --name hello-collab-env \
  --resource-group hello-collab-rg \
  --location eastus

# Deploy container app
az containerapp create \
  --name hello-collab-v3 \
  --resource-group hello-collab-rg \
  --environment hello-collab-env \
  --image hellocollab.azurecr.io/hello-collab:v3 \
  --target-port 3000 \
  --ingress external \
  --registry-server hellocollab.azurecr.io \
  --registry-username <username> \
  --registry-password <password> \
  --environment-variables \
    NODE_ENV=production \
    LOG_LEVEL=info \
  --secrets \
    client-id=<value> \
    client-secret=<value> \
    tenant-id=<value> \
    bot-id=<value> \
    bot-password=<value> \
    teams-app-id=<value>
```

### 4. Configure Secrets

Store sensitive values in Azure Key Vault:

```bash
# Create Key Vault
az keyvault create \
  --name hello-collab-kv \
  --resource-group hello-collab-rg

# Store secrets
az keyvault secret set \
  --vault-name hello-collab-kv \
  --name CLIENT-ID \
  --value <your-client-id>

# Grant access to Container App
az role assignment create \
  --role "Key Vault Secrets User" \
  --assignee <container-app-principal-id> \
  --scope /subscriptions/<sub-id>/resourceGroups/hello-collab-rg/providers/Microsoft.KeyVault/vaults/hello-collab-kv
```

### 5. Configure Monitoring

```bash
# Enable Application Insights
az monitor app-insights component create \
  --app hello-collab-insights \
  --location eastus \
  --resource-group hello-collab-rg

# Get instrumentation key and configure in app
```

### 6. Configure Custom Domain (Optional)

```bash
az containerapp hostname bind \
  --name hello-collab-v3 \
  --resource-group hello-collab-rg \
  --hostname your-domain.com
```

## Environment Variables

Create `.env.prod` for production:

```env
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
ENABLE_AUDIT_LOG=true

# These come from Key Vault via managed identity:
# CLIENT_ID
# CLIENT_SECRET
# TENANT_ID
# BOT_ID
# BOT_PASSWORD
# TEAMS_APP_ID

# Graph
GRAPH_ENDPOINT=https://graph.microsoft.com/v1.0
```

## Scaling Configuration

```bash
# Configure autoscaling
az containerapp update \
  --name hello-collab-v3 \
  --resource-group hello-collab-rg \
  --scale-rule-name cpu-scaling \
  --scale-rule-type cpu \
  --scale-rule-auth-trigger-secret none \
  --scale-rule-count-trigger 0.80
```

## Monitoring & Logging

```bash
# View container logs
az containerapp logs show \
  --name hello-collab-v3 \
  --resource-group hello-collab-rg

# View Application Insights
az monitor app-insights metrics show \
  --app hello-collab-insights \
  --resource-group hello-collab-rg
```

## Deployment Checklist

- [ ] Docker image builds successfully
- [ ] Image pushed to container registry
- [ ] Resource group created
- [ ] Container Apps Environment created
- [ ] Container App deployed
- [ ] Secrets stored in Key Vault
- [ ] Managed identity configured
- [ ] Custom domain bound (if needed)
- [ ] Application Insights monitoring
- [ ] Autoscaling configured
- [ ] Health checks passing
- [ ] Logs visible in Application Insights

## Rollback

```bash
# Revert to previous image
az containerapp update \
  --name hello-collab-v3 \
  --resource-group hello-collab-rg \
  --image hellocollab.azurecr.io/hello-collab:v2
```

## Cost Optimization

- Use vCPU/memory billing (pay per container instance)
- Configure autoscaling to reduce idle time
- Use Azure Container Registry with Standard SKU
- Monitor with Application Insights for usage patterns

## Troubleshooting

### Container won't start

```bash
# Check container logs
az containerapp logs show --name hello-collab-v3 --resource-group hello-collab-rg

# Check environment variables
az containerapp show --name hello-collab-v3 --resource-group hello-collab-rg
```

### Connection timeout

- Check Network Security Group rules
- Verify ingress configuration
- Confirm custom domain DNS resolution

### Graph API 401 errors

- Verify tokens in Key Vault
- Check Azure AD app permissions
- Ensure admin consent granted

---

**Last Updated**: May 19, 2026  
**Status**: Production-Ready Template  
**Estimated Deployment Time**: 15 minutes
