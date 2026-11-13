const bcrypt = require('bcryptjs');

async function main() {
  const password = process.argv[2];
  if (!password) {
    console.error('Usage: npm run hash-password -- <password>');
    process.exitCode = 1;
    return;
  }

  const hash = await bcrypt.hash(password, 12);
  console.log(hash);
}

main().catch(() => {
  console.error('Failed to generate password hash');
  process.exitCode = 1;
});
