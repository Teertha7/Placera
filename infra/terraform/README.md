# Placera Terraform Infrastructure as Code

This directory contains the Terraform configuration for provisioning the cloud infrastructure for **Placera** on Microsoft Azure.

---

## 1. Budget Constraint: Zero Out-of-Pocket Spending

This is an academic project designed to run within **Azure Student Credits ($100 free credit)** or locally using Docker Compose without spending personal funds.

### Cost Control Architectural Choices:
1. **Azure Static Web Apps (Free Tier)**: Serves the React frontend globally at zero cost.
2. **Azure Container Apps (Consumption Plan)**: Serverless container execution that scales to 0 replicas when inactive, incurring minimal charges only during active evaluation.
3. **Azure Container Registry (Basic SKU)**: Lowest-cost registry tier with 10GB storage.
4. **Log Analytics Workspace**: 30-day retention to prevent excess data ingestion charges.
5. **Azure Blob Storage (Standard LRS, Cool Tier)**: Private storage for resumes with negligible data footprint.
6. **Managed PostgreSQL Flexible Server**: Configured as an optional feature (`enable_managed_database = false` by default). When disabled, you run PostgreSQL locally or inside an Azure container. When enabled, it utilizes the lowest burstable SKU (`B_Standard_B1ms`).

---

## 2. Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform/downloads) >= 1.5.0
- [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) logged in via `az login`

---

## 3. Deployment Workflow

### Step 1: Initialize Terraform
```bash
terraform init
```

### Step 2: Validate Configuration
```bash
terraform validate
```

### Step 3: Generate Execution Plan (Always Review First)
```bash
cp terraform.tfvars.example terraform.tfvars
terraform plan -out=tfplan
```
> [!IMPORTANT]
> Always review the resources in `tfplan` before proceeding to avoid unexpected charges.

### Step 4: Apply (Explicit Approval Required)
```bash
terraform apply tfplan
```

### Step 5: Safe Teardown & Resource Destruction
When academic testing is finished, destroy all provisioned cloud resources to prevent ongoing charges:
```bash
terraform destroy
```

Verify in the Azure Portal or via CLI that the resource group is completely removed:
```bash
az group list --query "[?contains(name, 'placera')].name" -o table
```
