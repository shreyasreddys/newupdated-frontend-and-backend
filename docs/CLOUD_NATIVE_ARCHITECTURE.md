# EquiCart Cloud-Native Serverless Architecture

EquiCart is designed as a cloud-native retail and order management platform on AWS. The application uses managed and serverless services for hosting, authentication, APIs, business logic, data storage, asynchronous processing, security, and observability.

## Architecture Goals

- Host the React frontend globally with low latency.
- Protect customer and admin access with managed authentication.
- Expose backend capabilities through a single API entry point.
- Run business services without managing servers.
- Use asynchronous queues and notifications for order and payment workflows.
- Store transactional, catalog, and document data in managed AWS data services.
- Add monitoring, tracing, encryption, and web protection from the start.

## AWS Services Used

| Layer | AWS Services |
| --- | --- |
| DNS and CDN | Route 53, CloudFront |
| Frontend hosting | S3 static website assets |
| Authentication | Amazon Cognito, IAM |
| API layer | Amazon API Gateway |
| Compute | AWS Lambda, optional ECS Fargate for containerized Spring services |
| Messaging | Amazon SQS, Amazon SNS |
| Data | DynamoDB, Aurora Serverless/RDS, S3 |
| Security | IAM, KMS, Secrets Manager, AWS WAF |
| Observability | CloudWatch, X-Ray |
| CI/CD | GitHub, Jenkins, SonarQube, ECR, deployment pipeline |

## High-Level Request Flow

1. Users access the EquiCart web app through Route 53 and CloudFront.
2. CloudFront serves the React build from an encrypted S3 bucket.
3. Customers and admins authenticate with Amazon Cognito.
4. The frontend calls Amazon API Gateway with the Cognito/JWT token.
5. API Gateway routes requests to serverless backend services.
6. Lambda functions implement user, product, order, payment, and notification capabilities.
7. DynamoDB stores product catalog, carts, orders, payments, and user profile metadata.
8. S3 stores invoices, reports, backups, and static documents.
9. SQS decouples long-running workflows such as order processing and payment confirmation.
10. SNS sends email/SMS notifications to customers and admins.
11. CloudWatch captures logs, metrics, alarms, and dashboards.
12. X-Ray traces API Gateway, Lambda, and downstream service calls.

## Logical Service Design

### User Service

- Handles registration, login profile, and role-based access.
- Uses Cognito for identity and JWT issuance.
- Stores application profile metadata in DynamoDB.
- Protects secrets with AWS Secrets Manager.

### Product Service

- Manages product catalog, categories, pricing, and inventory.
- Uses DynamoDB for low-latency product lookup.
- Can use DynamoDB streams later for inventory events and search indexing.

### Order Service

- Creates and tracks customer orders.
- Stores order records in DynamoDB.
- Publishes order-created events to SQS for payment and notification workflows.

### Payment Service

- Processes payment requests through external payment gateway integration.
- Uses Secrets Manager for third-party payment credentials.
- Emits payment success/failure events to SNS/SQS.

### Notification Service

- Sends email, SMS, and order alerts.
- Consumes events from SQS and publishes messages through SNS.
- Keeps notification logic out of the synchronous checkout path.

## Data Strategy

| Data Type | Recommended Service | Reason |
| --- | --- | --- |
| Product catalog | DynamoDB | Fast key-value and query access |
| Orders | DynamoDB | Serverless scale, event-driven workflows |
| Users/profile metadata | DynamoDB + Cognito | Managed identity with app-specific profile fields |
| Payments | DynamoDB | Audit-friendly payment records |
| Invoices/reports | S3 | Durable object storage |
| Relational reporting | Aurora Serverless/RDS optional | SQL analytics and admin reporting |

## Security Design

- Cognito user pool manages customer and admin authentication.
- API Gateway authorizer validates tokens before invoking services.
- IAM roles follow least privilege for Lambda and data access.
- KMS encrypts DynamoDB tables, queues, topics, secrets, and S3 buckets.
- Secrets Manager stores database and payment provider credentials.
- AWS WAF protects CloudFront/API endpoints from common web attacks.
- CloudFront Origin Access Control prevents direct public access to S3.

## Observability Design

- CloudWatch log groups are created for each backend service.
- CloudWatch metrics track API latency, errors, Lambda duration, queue depth, and throttles.
- CloudWatch alarms notify the team when error rate or queue backlog grows.
- X-Ray tracing is enabled for API Gateway and Lambda functions.
- Structured logs should include request id, user id, service name, order id, and correlation id.

## Deployment Strategy

1. Build frontend with `npm run build`.
2. Upload the Vite `dist` output to the frontend S3 bucket.
3. Invalidate CloudFront cache after frontend deployment.
4. Package backend services as Lambda artifacts or container images.
5. Deploy infrastructure using CloudFormation from `infra/cloudformation/equicart-serverless.yaml`.
6. Store environment-specific values in CloudFormation parameters, Secrets Manager, and SSM if added later.

## Presentation Summary

EquiCart uses AWS managed services to reduce operational overhead. The frontend is globally distributed through CloudFront and S3. API Gateway and Cognito secure the API layer. Business capabilities run as independent Lambda-backed services. DynamoDB, S3, SQS, and SNS provide scalable data and event processing. IAM, KMS, Secrets Manager, WAF, CloudWatch, and X-Ray make the system secure, observable, and production-ready.
