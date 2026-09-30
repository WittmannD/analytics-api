# Analytics API

A secure NestJS-based REST API that acts as a middleware for Google Analytics (GA4) event tracking. This service simplifies event collection and provides built-in authentication, validation, and session management.

## Features

- 🔐 **Secure Authentication** - API Secret and Measurement ID validation via custom guards
- 📊 **Multiple Event Types** - Support for page views, first visits, campaigns, deposits, and custom events
- 📦 **Batch Operations** - Send multiple events in a single request
- 🔄 **Session Management** - Automatic session creation and tracking
- ✅ **Event Validation** - Comprehensive parameter validation with detailed error messages
- 📖 **OpenAPI/Swagger Documentation** - Auto-generated API docs with request/response schemas
- 🐛 **Debug Mode** - Built-in debugging for Google Analytics Measurement Protocol

## Supported Events

### Page View
Track when users view pages or bot command outputs.

**Endpoint:** `POST /analytics/page_view`

### First Visit
Capture user's first visit and traffic source information.

**Endpoint:** `POST /analytics/first_visit`

### Campaign Details
Associate traffic sources with user sessions for session-level source tracking.

**Endpoint:** `POST /analytics/campaign_details`

### Deposit
Track user balance top-ups and financial transactions.

**Endpoint:** `POST /analytics/deposit`

### Custom Events
Batch send custom events with flexible parameters.

**Endpoint:** `POST /analytics/custom`

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Analytics GA4 property
- GA4 API Secret and Measurement ID

### Installation

```bash
# Clone the repository
git clone https://github.com/WittmannD/analytics-api.git
cd analytics-api

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the project root:

```env
# Google Analytics Configuration
GA_MEASUREMENT_ID=your_measurement_id
GA_API_SECRET=your_api_secret

# Server Configuration
PORT=3000
NODE_ENV=development

# Debug Mode (optional)
DEBUG=false
```

### Running the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Authentication

All endpoints require two security headers:

```http
X-GA-API-SECRET: your_api_secret
X-GA-MEASUREMENT-ID: your_measurement_id
```

These can also be provided via:
- Query parameters: `?gaApiSecret=...&gaMeasurementId=...`
- Swagger UI security configuration

## API Documentation

Once the application is running, visit:

```
http://localhost:3000/api/docs
```

This provides an interactive Swagger UI with:
- Complete endpoint documentation
- Request/response schemas
- Error response examples
- Try-it-out functionality

## Project Structure

```
src/
├── analytics/                          # Analytics service layer
│   ├── analytics.controller.ts         # HTTP endpoints
│   ├── analytics.service.ts            # Business logic
│   └── dto/                            # Data transfer objects
│
├── measurement-protocol/               # Google Analytics integration
│   ├── measurement-protocol.service.ts # MP/Collect API client
│   ├── analytics-internal-api.service.ts # GA internal API client
│   └── session.service.ts              # Session management
│
└── common/                             # Shared utilities
    ├── decorators/                     # Custom decorators
    ├── guards/                         # Authentication guards
    ├── pipes/                          # Request validation pipes
    ├── errors/                         # Custom error classes
    └── utils/                          # Helper functions
```

## Request/Response Examples

### Page View Event

**Request:**
```json
{
  "client_id": "user123",
  "user_id": "optional_user_id",
  "event": {
    "page_title": "My Page",
    "page_location": "https://example.com/page",
    "engagement_time_msec": 100
  }
}
```

**Response:**
```json
{
  "client_id": "user123",
  "session_id": 1
}
```

### Custom Events (Batch)

**Request:**
```json
{
  "client_id": "user123",
  "user_id": "optional_user_id",
  "events": [
    {
      "name": "button_click",
      "params": {
        "button_name": "submit"
      }
    },
    {
      "name": "form_submit",
      "params": {
        "form_id": "contact_form"
      }
    }
  ]
}
```

## Error Handling

The API returns standardized error responses:

### 403 Forbidden
Missing or invalid GA API Secret header.

```json
{
  "statusCode": 403,
  "message": "X-GA-API-SECRET header is missing or contains an invalid GA API Secret.",
  "error": "Forbidden"
}
```

### 422 Unprocessable Entity
Event parameters failed validation.

```json
{
  "statusCode": 422,
  "message": "Event parameters failed validation.",
  "error": "Unprocessable Entity"
}
```

## Technology Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **HTTP Client:** Axios (via @nestjs/axios)
- **Documentation:** Swagger/OpenAPI
- **Google Analytics:** Measurement Protocol & GA4 Reporting API

## Configuration Options

The Measurement Protocol service supports the following configuration:

```typescript
{
  apiSecret: string;
  measurementId: string;
  defaultEngagementTimeMsec?: number; // Default: 100
  debug?: boolean; // Use GA debug endpoint
}
```

## Development

```bash
# Run linter
npm run lint

# Format code
npm run format

# Run tests
npm run test

# Watch mode
npm run test:watch
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

**Built with ❤️ using NestJS**
