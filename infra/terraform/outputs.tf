output "resource_group_name" {
  value       = azurerm_resource_group.rg.name
  description = "Name of the provisioned Azure Resource Group"
}

output "acr_login_server" {
  value       = azurerm_container_registry.acr.login_server
  description = "Login server endpoint for Azure Container Registry"
}

output "acr_name" {
  value       = azurerm_container_registry.acr.name
  description = "Name of the Azure Container Registry"
}

output "container_app_environment_id" {
  value       = azurerm_container_app_environment.env.id
  description = "ID of the Azure Container Apps Environment"
}

output "storage_account_name" {
  value       = azurerm_storage_account.storage.name
  description = "Name of the Azure Storage Account for private resumes"
}

output "frontend_default_hostname" {
  value       = azurerm_static_web_app.frontend.default_host_name
  description = "Default public URL of the deployed Azure Static Web App"
}

output "postgresql_fqdn" {
  value       = var.enable_managed_database ? azurerm_postgresql_flexible_server.db[0].fqdn : "Managed PostgreSQL disabled (using local dev or Azure Container)"
  description = "Fully qualified domain name of PostgreSQL database server"
}
