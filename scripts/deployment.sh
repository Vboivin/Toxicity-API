#!/usr/bin/env sh

RG_NAME="htn2021"
AZURE_REGION="canadacentral"
RG_LOCATION="./infra/rg"
FUNCTIONS_LOCATION="./infra/function_app"
TEMPLATE="template.json"
PARAMETERS="parameters.json"

create_rg () {
	az deployment sub create \
		-l "$AZURE_REGION" \
		--template-file "$RG_LOCATION/$TEMPLATE" \
		--parameters "$RG_LOCATION/$PARAMETERS"
}

deploy_to_rg () {
	az deployment group create \
		--resource-group "$RG_NAME" \
		--template-file "$1" \
		--parameters "$2"
}

create_rg
deploy_to_rg "$FUNCTIONS_LOCATION/$TEMPLATE" "$FUNCTIONS_LOCATION/$PARAMETERS"
