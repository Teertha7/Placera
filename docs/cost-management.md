# Placera Cloud Cost Optimization & Budget Containment Guide

## 1. Zero Personal Spending Philosophy

Placera is engineered with a strict **Zero Out-of-Pocket Cost Constraint**. As an academic and portfolio project built on a student budget, financial safety is a core architectural requirement.

The platform provides two deployment tiers:
1. **$0.00 / month Local Evaluation (Default & Recommended)**: Complete end-to-end functionality (PostgreSQL, Spring Boot API, React frontend, Flyway migrations, resume storage, and load testing) runs locally inside Docker Desktop with **zero cloud dependencies** and **zero financial exposure**.
2. **Near-Zero Azure Cloud Evaluation**: When deploying to Microsoft Azure, infrastructure is architected to utilize **Always Free** tiers, **Consumption (Scale-to-Zero)** models, and aggressive budget caps.

---

## 2. Azure Cloud Cost Breakdown & Free Tier Optimization

When deploying to Microsoft Azure using the provided Terraform configurations (`infra/terraform/`), resources are aligned with Azure Free Tier allotments:

| Azure Resource | Selected Tier / SKU | Monthly Free Tier Allotment | Estimated Cost (Within Quota) |
| :--- | :--- | :--- | :--- |
| **Azure Static Web Apps** | `Free` SKU | Free SSL, global CDN, custom domains, 100 GB bandwidth/month | **$0.00** |
| **Azure Container Apps** | `Consumption` Serverless | First **180,000 vCPU-seconds**, **360,000 GiB-seconds**, and **2,000,000 requests** free per month | **$0.00** (Scales to 0 when idle) |
| **Azure Container Registry** | `Basic` SKU | 10 GB storage, standard webhooks | **~$0.16 / day** (approx. $5/mo, or $0 with GHCR) |
| **Azure Blob Storage** | `Standard_LRS` (Cool) | 5 GB LRS storage in 12-month free trial | **<$0.05 / month** |
| **Log Analytics & Insights** | `PerGB2018` | First **5 GB ingestion/month** free | **$0.00** |
| **PostgreSQL Database** | Flexible Server (`B1ms`) | Burstable single-core compute | **~$12 - $15 / month** (or **$0.00** self-hosted in ACA) |

---

## 3. Cost Containment Architecture: Scale-to-Zero

In traditional cloud deployments, idling virtual machines or dedicated Kubernetes clusters incur 24/7 compute billing regardless of traffic. 

Placera eliminates idle compute costs by utilizing **Azure Container Apps Serverless Consumption**:
- `min_replicas = 0`: When no HTTP requests are arriving at the application, Container Apps automatically scales the backend container down to **zero running instances**.
- **Cold Start Wakeup**: Upon arrival of the first HTTP request, Container Apps instantiates a container, executes the Spring Boot initialization in ~8 seconds, and handles the request.
- **Compute Metering**: You are only billed for the exact seconds CPU and RAM are executing active requests.

---

## 4. Azure Budget Alerts & Safety Thresholds

To guarantee that accidental usage never generates unexpected bills, execute the following script using the Azure CLI to establish budget alerts:

```bash
# Set your target budget amount (e.g., $10.00 USD)
BUDGET_AMOUNT=10.00
NOTIFICATION_EMAIL="your-email@placera.edu"
RESOURCE_GROUP="rg-placera-prod"

# Create a resource-group-level budget alert at 50%, 80%, and 100% thresholds
az consumption budget create \
  --budget-name "PlaceraStudentSafetyBudget" \
  --amount $BUDGET_AMOUNT \
  --time-grain monthly \
  --start-date $(date -u +%Y-%m-01) \
  --end-date $(date -u -v+1y +%Y-%m-01 2>/dev/null || date -u -d "+1 year" +%Y-%m-01) \
  --resource-group $RESOURCE_GROUP \
  --meter-filter-category "Virtual Machines" "Storage" "Container Apps" \
  --contact-emails $NOTIFICATION_EMAIL
```

---

## 5. Clean Teardown Checklist (Zero Ongoing Billing)

When cloud testing, grading, or demonstration sessions conclude, destroy all cloud resources immediately to halt all storage and compute charges.

### Option A: Complete Terraform Teardown (Recommended)
```bash
cd infra/terraform
terraform destroy -auto-approve
```

### Option B: Immediate Azure CLI Resource Group Deletion
Deleting the parent resource group instantly destroys all nested resources (Container Apps, Database, Storage Account, ACR, and Log Analytics):
```bash
az group delete --name rg-placera-prod --yes --no-wait
```

### Verification Command:
Verify that the resource group has been completely eradicated:
```bash
az group exists --name rg-placera-prod
# Output should return: false
```
