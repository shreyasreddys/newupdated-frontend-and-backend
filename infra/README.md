# EquiCart AWS Infrastructure

This folder contains the cloud-native/serverless blueprint for EquiCart.

## What It Creates

- S3 bucket for React static hosting.
- CloudFront distribution for CDN delivery.
- Cognito user pool, web client, and admin/customer groups.
- HTTP API Gateway.
- Lambda service placeholders for user, product, order, payment, and notification services.
- DynamoDB tables for products, orders, user profiles, and payments.
- SQS order queue and dead-letter queue.
- SNS notification topic.
- S3 bucket for reports, invoices, and documents.
- KMS key for encryption.
- Secrets Manager payment gateway secret.
- WAF web ACL.
- CloudWatch alarms.
- X-Ray tracing on Lambda.
- Optional Route 53 alias record.

## Deploy

Because this blueprint includes a CloudFront-scoped AWS WAF web ACL, deploy it from `us-east-1` for a single-stack demo. For production, split edge resources such as CloudFront, WAF, and Route 53 from regional API/Lambda/DynamoDB resources if you want the backend in another region such as `ap-south-1`.

```powershell
aws cloudformation deploy `
  --stack-name equicart-dev `
  --template-file infra/cloudformation/equicart-serverless.yaml `
  --capabilities CAPABILITY_NAMED_IAM `
  --parameter-overrides ProjectName=equicart StageName=dev
```

With notification email:

```powershell
aws cloudformation deploy `
  --stack-name equicart-dev `
  --template-file infra/cloudformation/equicart-serverless.yaml `
  --capabilities CAPABILITY_NAMED_IAM `
  --parameter-overrides ProjectName=equicart StageName=dev NotificationEmail=you@example.com
```

## Frontend Deployment

Build the React app:

```powershell
cd equicart-frontend
npm run build
```

Upload the build output to the generated frontend bucket:

```powershell
aws s3 sync dist s3://YOUR_FRONTEND_BUCKET_NAME --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Backend Implementation Note

The CloudFormation template currently includes Lambda placeholder handlers so the infrastructure can be deployed and demonstrated. The existing Spring Boot services can be connected in one of two ways:

- Package each Spring Boot service for Lambda using `aws-serverless-java-container`.
- Package each service as a container image and run it on AWS Lambda container image support or ECS Fargate.

For a project presentation, the template demonstrates the target AWS architecture and all major cloud services used by EquiCart.
