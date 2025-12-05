# Custom API Configuration Guide

## 🎯 Overview

Starting with version **1.1.0**, the Pack-Man Chrome Extension supports **configurable API endpoints**. This feature enables organizations and individuals to use self-hosted Pack-Man instances instead of the default public API.

---

## 🌟 Why Custom API Endpoints?

### For Organizations
- ✅ **Data Privacy**: Analyze internal repositories without sending data to external servers
- ✅ **Custom Policies**: Implement organization-specific security policies
- ✅ **No Rate Limits**: Control your own infrastructure and limits
- ✅ **Internal Networks**: Use behind corporate firewalls

### For Open Source Community
- ✅ **Self-Hosting**: Run Pack-Man on your own infrastructure
- ✅ **Customization**: Modify the API to suit your needs
- ✅ **Learning**: Study and improve the codebase
- ✅ **Contribution**: Test changes before submitting PRs

---

## 🚀 Quick Start

### Step 1: Set Up Your Pack-Man Instance

**Option A: Deploy to Vercel**
```bash
# Clone the repository
git clone https://github.com/gzpaitch/pack-man.git
cd pack-man

# Deploy to Vercel
vercel deploy

# Get your deployment URL (e.g., https://your-app.vercel.app)
```

**Option B: Run Locally**
```bash
# Clone and install
git clone https://github.com/gzpaitch/pack-man.git
cd pack-man
pnpm install

# Start development server
pnpm dev

# Your API will be at: http://localhost:3000/api/analyze-packages
```

**Option C: Docker**
```bash
# Build and run with Docker
docker build -t pack-man .
docker run -p 3000:3000 pack-man

# API endpoint: http://localhost:3000/api/analyze-packages
```

### Step 2: Configure Extension

1. **Open Pack-Man Extension**
   - Click the extension icon in Chrome toolbar

2. **Go to API Configuration Section**
   - Scroll down to "API Configuration" card

3. **Enter Your API Endpoint**
   ```
   https://your-domain.com/api/analyze-packages
   ```
   or for local development:
   ```
   http://localhost:3000/api/analyze-packages
   ```

4. **Click "Save & Test"**
   - Extension will validate the endpoint
   - If valid, it will be saved automatically
   - Cache is cleared to prevent stale data

5. **Done!** ✅
   - All repository analyses now use your custom API

---

## 🔧 API Endpoint Requirements

Your custom API endpoint must:

### 1. Accept POST Requests
```http
POST /api/analyze-packages
Content-Type: application/json
```

### 2. Accept This Request Format
```json
{
  "content": "{ \"dependencies\": { \"react\": \"^18.0.0\" } }",
  "fileName": "package.json"
}
```

### 3. Return This Response Format
```json
{
  "packages": [
    {
      "name": "react",
      "currentVersion": "18.0.0",
      "latestVersion": "18.2.0",
      "status": "outdated",
      "packageManager": "npm"
    }
  ],
  "summary": {
    "total": 1,
    "upToDate": 0,
    "outdated": 1,
    "errors": 0
  }
}
```

### 4. Handle Errors Properly
```json
{
  "error": "Error message here",
  "packages": [],
  "summary": {
    "total": 0,
    "upToDate": 0,
    "outdated": 0,
    "errors": 0
  }
}
```

---

## ✅ Validation Process

When you click "Save & Test", the extension:

### 1. **URL Validation**
- Checks if URL is properly formatted
- Ensures HTTP(S) protocol is used
- Validates URL structure

### 2. **Connection Test**
Sends a test request:
```json
{
  "content": "{\"dependencies\":{\"test\":\"1.0.0\"}}",
  "fileName": "package.json"
}
```

### 3. **Response Validation**
- Checks if API responds with 200 OK
- Validates response has `packages` and `summary` fields
- Ensures response structure matches expected format

### 4. **Result**
- ✅ **Valid**: Endpoint is saved and ready to use
- ❌ **Invalid**: Error message shows what went wrong

---

## 🎮 Usage Examples

### Example 1: Vercel Deployment
```
Endpoint: https://pack-man-prod.vercel.app/api/analyze-packages
Status: ✅ Valid
Response Time: 450ms
```

### Example 2: Local Development
```
Endpoint: http://localhost:3000/api/analyze-packages
Status: ✅ Valid
Response Time: 50ms
Note: Only works while dev server is running
```

### Example 3: Custom Domain
```
Endpoint: https://pack-man.yourcompany.com/api/analyze-packages
Status: ✅ Valid
Response Time: 200ms
Note: Perfect for internal company use
```

### Example 4: Self-Hosted on AWS
```
Endpoint: https://api.yoursite.com/pack-man/analyze
Status: ❌ Invalid
Error: API response format is incorrect
Note: Ensure your API matches the expected format
```

---

## 🔄 Switching Between APIs

### Reset to Default
1. Click "Reset to Default" button
2. Extension reverts to public API
3. Cache is automatically cleared

### Switch to Custom API
1. Enter your custom endpoint
2. Click "Save & Test"
3. Validation runs automatically
4. Cache is cleared on successful save

### View Current API
- Current endpoint is always displayed in the input field
- Status message shows if using default or custom
- "Reset to Default" button is disabled when using default

---

## 🐛 Troubleshooting

### Problem: "Cannot reach API"
**Possible Causes:**
- API server is not running
- Firewall blocking connection
- Incorrect URL

**Solutions:**
```bash
# Check if API is running
curl -X POST https://your-api.com/api/analyze-packages \
  -H "Content-Type: application/json" \
  -d '{"content":"{}","fileName":"package.json"}'

# Check local server
lsof -i :3000  # Should show Node process
```

### Problem: "API response format is incorrect"
**Possible Causes:**
- Custom API doesn't match expected format
- API is returning different structure

**Solutions:**
1. Check API response format matches documentation
2. Ensure `packages` and `summary` fields exist
3. Validate response is valid JSON

### Problem: "Request timeout"
**Possible Causes:**
- API is too slow (>10 seconds)
- Network issues

**Solutions:**
1. Optimize your API performance
2. Check network connection
3. Consider increasing timeout (requires code modification)

### Problem: "CORS error in browser console"
**Possible Causes:**
- API doesn't have proper CORS headers

**Solutions:**
Add CORS headers to your API:
```javascript
// In your API route
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

---

## 🔒 Security Considerations

### For Self-Hosted Instances

1. **HTTPS is Recommended**
   - Use HTTPS in production
   - HTTP is acceptable for localhost only
   - Protects data in transit

2. **Authentication**
   - Current version doesn't support auth headers
   - Use network-level security (VPN, firewall)
   - Consider implementing IP whitelisting

3. **Rate Limiting**
   - Implement rate limiting on your API
   - Protect against abuse
   - Extension respects 429 responses

4. **Data Privacy**
   - Self-hosted = full control over data
   - No external data transmission
   - Comply with your organization's policies

---

## 📊 Performance Tips

### Optimize Your API

1. **Enable Caching**
   ```javascript
   // Cache package lookups for 5 minutes
   const cache = new Map();
   ```

2. **Use CDN for Static Assets**
   - Deploy API behind CDN
   - Reduce latency globally

3. **Implement Retry Logic**
   - Extension has built-in retry
   - API should handle transient failures

4. **Monitor Response Times**
   - Keep responses under 10 seconds
   - Extension has 10s timeout

### Extension-Side Caching

The extension automatically caches:
- ✅ Successful results: 5 minutes
- ⚠️ Error results: 2 minutes
- 📊 Maximum 100 entries

---

## 🔮 Advanced Configurations

### Custom API with Authentication

**Current Limitation:** Extension doesn't support custom auth headers yet.

**Workaround Options:**
1. Use network-level authentication (VPN)
2. IP whitelisting on API server
3. Cookie-based authentication

**Future Feature:** Auth header configuration (coming soon)

### Load Balancing

For high-traffic scenarios:
```
Extension → Load Balancer → Multiple API Instances
             (e.g., Nginx)    (Scaled horizontally)
```

### Monitoring

Track API health:
```javascript
// Add monitoring to your API
app.post('/api/analyze-packages', async (req, res) => {
  const startTime = Date.now();
  // ... your code ...
  const duration = Date.now() - startTime;
  console.log(`API request took ${duration}ms`);
});
```

---

## 📝 API Endpoint Storage

### Where is it Stored?
- **Location**: Chrome's `chrome.storage.local`
- **Key**: `api_endpoint`
- **Format**: Plain text URL string
- **Persistence**: Survives browser restarts

### Clear Configuration
To manually clear:
1. Open Chrome DevTools (F12)
2. Go to Application tab
3. Storage → Local Storage → Extension ID
4. Delete `api_endpoint` key

Or use this in console:
```javascript
chrome.storage.local.remove('api_endpoint', () => {
  console.log('API endpoint cleared');
});
```

---

## 🎯 Use Cases

### 1. Corporate Environment
```
Company Network
  ├── Internal Pack-Man API
  │   └── Behind corporate firewall
  │   └── Authenticated via VPN
  └── All employees use extension with internal API
```

### 2. Development Testing
```
Developer Workflow
  ├── Run Pack-Man locally (localhost:3000)
  ├── Configure extension to use local API
  ├── Test changes in real-time
  └── Submit PR when ready
```

### 3. Compliance Requirements
```
Regulated Industry
  ├── Cannot use external APIs
  ├── Must audit all data flows
  ├── Self-host on approved infrastructure
  └── Extension configured to internal API
```

### 4. Performance Optimization
```
Global Organization
  ├── Deploy Pack-Man in multiple regions
  │   ├── US: pack-man-us.company.com
  │   ├── EU: pack-man-eu.company.com
  │   └── APAC: pack-man-apac.company.com
  └── Users configure nearest endpoint
```

---

## 🤝 Contributing

### Testing API Changes

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/pack-man.git
   ```

2. **Make Your Changes**
   ```bash
   # Modify API in src/app/api/analyze-packages/route.ts
   ```

3. **Test with Extension**
   ```bash
   # Run locally
   pnpm dev
   
   # Configure extension to http://localhost:3000/api/analyze-packages
   # Test your changes
   ```

4. **Submit PR**
   - Include test results
   - Document API changes
   - Update this guide if needed

---

## 📚 Related Documentation

- [Extension README](./README.md) - General extension documentation
- [Improvements Log](./IMPROVEMENTS.md) - All version changes
- [Main Project README](../README.md) - Pack-Man application documentation

---

## ❓ FAQ

### Q: Can I use multiple API endpoints?
**A:** Not currently. The extension supports one active endpoint at a time. You can switch between them, but only one is active.

### Q: Will my custom API be publicly accessible?
**A:** Only if you make it public. You have full control over your API's network exposure.

### Q: What happens if my custom API goes down?
**A:** Analyses will fail with error messages. You can reset to the default public API anytime.

### Q: Can I test my API before configuring?
**A:** Yes! Use curl or Postman to test your API manually before adding it to the extension.

### Q: Does the extension send any data to the original API when using custom endpoint?
**A:** No. When a custom endpoint is configured, ALL requests go to your custom API only.

### Q: Can I use this with GitHub Enterprise?
**A:** Yes! Perfect use case. Set up Pack-Man behind your firewall and configure the extension.

---

## 🎉 Summary

The Custom API Configuration feature makes Pack-Man truly **open source** and **enterprise-ready**:

✅ Full control over your data
✅ Support for private/internal deployments
✅ Easy configuration with validation
✅ Automatic cache management
✅ One-click reset to default
✅ Perfect for organizations and individuals

**Get started today and take control of your dependency analysis!** 🚀
