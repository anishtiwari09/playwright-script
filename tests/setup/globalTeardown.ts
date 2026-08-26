export default async function globalTeardown() {
  // Add explicit cleanup to ensure Firefox sockets close properly
  console.log('Global teardown: Cleaning up resources and closing any remaining connections.');
  
  // Small delay to allow Firefox to fully cleanup
  await new Promise(resolve => setTimeout(resolve, 500));
}
