import AWS from "aws-sdk";

// Configure the AWS SDK
AWS.config.update({ region: "us-east-1" }); // Replace "your-region" with your AWS region

const secretsManager = new AWS.SecretsManager();

async function getSecrets(secretName) {
  try {
    const result = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
    if (result.SecretString) {
      return JSON.parse(result.SecretString); // Secrets are typically stored as JSON
    }
  } catch (error) {
    console.error("Error fetching secret:", error);
    throw new Error("Failed to fetch secrets from Secrets Manager.");
  }
}

// Example usage
(async () => {
  const secretName = "ucraft-secrets"; // Replace with your secret's name
  const secrets = await getSecrets(secretName);
  console.log("Fetched secrets:", secrets);

  // Access individual secrets
  const replicateToken = secrets.REPLICATE_API_TOKEN;
  const dbPassword = secrets.DB_PASSWORD;
})();

export default getSecrets;