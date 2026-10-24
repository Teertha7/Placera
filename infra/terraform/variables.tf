variable "project_name" {
  type        = string
  default     = "placera"
  description = "Name of the project used in resource naming conventions"
}

variable "environment" {
  type        = string
  default     = "dev"
  description = "Target deployment environment (dev, staging, prod)"
}

variable "location" {
  type        = string
  default     = "centralindia"
  description = "Azure primary region for resource provisioning"
}

variable "enable_managed_database" {
  type        = bool
  default     = false
  description = "Toggle managed Azure PostgreSQL Flexible Server. Set false to stay 100% within free student tier"
}

variable "db_admin_username" {
  type        = string
  default     = "placeraadmin"
  description = "Administrator username for PostgreSQL Flexible Server"
}

variable "db_admin_password" {
  type        = string
  sensitive   = true
  default     = "PlaceraAzureDb2026!#"
  description = "Administrator password for PostgreSQL Flexible Server"
}

variable "tags" {
  type        = map(string)
  default = {
    Project     = "Placera"
    Environment = "Student-Academic"
    CostCenter  = "Zero-Spending-Budget"
    ManagedBy   = "Terraform"
  }
  description = "Resource tags applied to all Azure components for billing tracking"
}
