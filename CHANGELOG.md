# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
The version here, the `v<version>` git tag and the `version` field in
`package.json` always agree.

## [Unreleased]

## [0.1.0] - 2026-09-12

### Added

- `@ctl456/dsh-mcp-manager`: an opt-in DeepSeek Harness bundle that keeps one
  list of external MCP servers and mounts one `dsh-mcp-client` connection per
  enabled entry, so each server's tools are callable as
  `mcp__<name>__<tool>`.
- A dedicated **Settings → MCP servers** page, below **Agent presets**, with a
  search box, a list that pages five servers at a time, and an add dialog
  covering both the stdio and Streamable HTTP transports.
- The `mcp_manager_list`, `mcp_manager_add`, `mcp_manager_remove` and
  `mcp_manager_set_enabled` tools, which manage the same `mcp-manager` section
  of `$DSH_HOME/settings.yaml` from chat.

[Unreleased]: https://github.com/ctl456/dsh-mcp-manager/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/ctl456/dsh-mcp-manager/releases/tag/v0.1.0
