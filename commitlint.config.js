// Conventional Commits, enforced at commit time (Husky commit-msg hook).
// Format:  type(scope): subject     e.g.  feat(core): add auth interceptor
// Types follow @commitlint/config-conventional:
//   feat | fix | docs | style | refactor | perf | test | build | ci | chore | revert
// See project-playbook/GitStrategy.md for branch naming and PR rules.
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
