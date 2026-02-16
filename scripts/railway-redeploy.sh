#!/bin/bash
# Railway API script to delete old service and create new one

TOKEN=$(cat ~/.railway/config.json | python3 -c "import sys,json; print(json.load(sys.stdin)['user']['token'])")
PROJECT_ID="ea8d43c6-49e0-4420-b99e-39e7552d50c2"
OLD_SERVICE_ID="853c0423-b149-4736-886c-75eaddcc9660"
ENV_ID="60f57148-83f7-430b-af0c-ecbbfa9ddb4a"

echo "=== Step 1: Delete old service ==="
RESULT=$(curl -s --request POST \
  --url https://backboard.railway.com/graphql/v2 \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/json" \
  --data "{\"query\":\"mutation { serviceDelete(id: \\\"$OLD_SERVICE_ID\\\") }\"}")
echo "$RESULT"

echo ""
echo "=== Step 2: Create new service ==="
RESULT=$(curl -s --request POST \
  --url https://backboard.railway.com/graphql/v2 \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/json" \
  --data "{\"query\":\"mutation { serviceCreate(input: { projectId: \\\"$PROJECT_ID\\\", name: \\\"overline-backend\\\", source: { repo: \\\"manraj777/overline\\\" } }) { id name } }\"}")
echo "$RESULT"

# Extract new service ID
NEW_SERVICE_ID=$(echo "$RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['serviceCreate']['id'])" 2>/dev/null)
echo "New service ID: $NEW_SERVICE_ID"

if [ -z "$NEW_SERVICE_ID" ]; then
  echo "Failed to create service"
  exit 1
fi

echo ""
echo "=== Step 3: Update service instance settings ==="
RESULT=$(curl -s --request POST \
  --url https://backboard.railway.com/graphql/v2 \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/json" \
  --data "{\"query\":\"mutation { serviceInstanceUpdate(serviceId: \\\"$NEW_SERVICE_ID\\\", environmentId: \\\"$ENV_ID\\\", input: { rootDirectory: \\\"apps/backend\\\", startCommand: \\\"node -r tsconfig-paths/register dist/main.js\\\" }) }\"}")
echo "$RESULT"

echo ""
echo "=== Step 4: Set environment variables ==="
VARS=(
  "DATABASE_URL=postgresql://neondb_owner:npg_pbXz3o7kEyve@ep-young-butterfly-a1tk2wak-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
  "REDIS_URL=redis://default:AbmlAAIncDI5NmRhNTlhYTEyMmI0NDZhYmNiMWRjZmVjYzgxNTdkZXAyNDc1MjU@set-firefly-47525.upstash.io:6379"
  "JWT_SECRET=9wUu8wvZlW1ktQcTkg7KFbcfftIY++ThJSm9F2GtcMQ="
  "NODE_ENV=production"
  "PORT=3000"
)

for VAR in "${VARS[@]}"; do
  KEY="${VAR%%=*}"
  VALUE="${VAR#*=}"
  # Escape special chars for JSON
  VALUE_ESCAPED=$(echo "$VALUE" | sed 's/\\/\\\\/g; s/"/\\"/g')
  RESULT=$(curl -s --request POST \
    --url https://backboard.railway.com/graphql/v2 \
    --header "Authorization: Bearer $TOKEN" \
    --header "Content-Type: application/json" \
    --data "{\"query\":\"mutation { variableUpsert(input: { projectId: \\\"$PROJECT_ID\\\", environmentId: \\\"$ENV_ID\\\", serviceId: \\\"$NEW_SERVICE_ID\\\", name: \\\"$KEY\\\", value: \\\"$VALUE_ESCAPED\\\" }) }\"}")
  echo "Set $KEY: $RESULT"
done

echo ""
echo "=== Step 5: Generate domain ==="
RESULT=$(curl -s --request POST \
  --url https://backboard.railway.com/graphql/v2 \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/json" \
  --data "{\"query\":\"mutation { serviceDomainCreate(input: { serviceId: \\\"$NEW_SERVICE_ID\\\", environmentId: \\\"$ENV_ID\\\" }) { domain } }\"}")
echo "$RESULT"

echo ""
echo "=== Step 6: Deploy ==="
RESULT=$(curl -s --request POST \
  --url https://backboard.railway.com/graphql/v2 \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/json" \
  --data "{\"query\":\"mutation { serviceInstanceDeployV2(serviceId: \\\"$NEW_SERVICE_ID\\\", environmentId: \\\"$ENV_ID\\\") }\"}")
echo "$RESULT"

echo ""
echo "=== Done! New service ID: $NEW_SERVICE_ID ==="
echo "Update your railway config with: railway link $NEW_SERVICE_ID"
