const { execSync } = require('child_process');
execSync('next build', { stdio: 'inherit' });


try {
  // Disable ESLint during build
  process.env.NEXT_DISABLE_ESLINT = '1';
  
  console.log('Building with ESLint disabled...');
  execSync('next build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}