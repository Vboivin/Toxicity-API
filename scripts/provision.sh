#!/usr/bin/env sh

RG_NAME="htn2021"
AZURE_REGION="canadacentral"

RESOURCE_GROUP="./infra/ResourceGroup"
FUNCTION_APP="./infra/FunctionApp"
FRONT_DOOR="./infra/FrontDoor"
FRONT_DOOR_WAF_POLICY="./infra/FrontDoorWafPolicy"

TEMPLATE="template.json"
PARAMETERS="parameters.json"

deploy_rg() {
	az deployment sub create \
		-l "$AZURE_REGION" \
		--template-file "$RESOURCE_GROUP/$TEMPLATE" \
		--parameters "$RESOURCE_GROUP/$PARAMETERS"
}

deploy() {
	az deployment group create \
		--resource-group "$RG_NAME" \
		--template-file "$1/$TEMPLATE" \
		--parameters "$1/$PARAMETERS"
}

if [ "$ADMIN" == 'true' ]; then
  deploy_rg;
fi
deploy "$FUNCTION_APP";
deploy "$FRONT_DOOR";
deploy "$FRONT_DOOR_WAF_POLICY"
