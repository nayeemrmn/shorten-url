# Tools
NODE = node
NODE_FLAGS = --experimental-modules
NPM = npm
ESLINT = $(shell $(NPM) bin)/eslint
PRETTIER = $(shell $(NPM) bin)/prettier

# Files and directories
NODE_MODULES = node_modules
PACKAGE_JSON = package.json
PRETTIER_TARGETS = **/*.{js,json,md}
SERVER_JS = src/server.js

# Server environment
ENVIRONMENT = \
	ADMIN_USERNAME=admin \
	ADMIN_PASSWORD=password \
	MONGODB_URI=mongodb://127.0.0.1:27017/shorten-url \
	PORT=8000

.PHONY: all clean server lint format-check format

all: $(NODE_MODULES)/

# Install node dependencies.
$(NODE_MODULES)/: $(PACKAGE_JSON)
	@echo "Install node dependencies."
	@$(NPM) install
	@mkdir -p $(NODE_MODULES)
	@touch $(NODE_MODULES)

# Remove build files.
clean:
	@echo "Remove '$(NODE_MODULES)'."
	@rm -rf $(NODE_MODULES)

# Start a server for local testing at port $(PORT).
# Environment requirements:
#   - An installation of node whose version complies with package.json.
#   - A MongoDB database being served at $(MONGODB_URI).
# Protected endpoints may be accessed using credentials containing
# $(ADMIN_USERNAME):$(ADMIN_PASSWORD).
server: $(NODE_MODULES)/
	@echo "Start the server."
	@$(ENVIRONMENT) $(NODE) $(NODE_FLAGS) $(SERVER_JS)

# Lint.
lint:
	@echo "Lint with ESLint."
	@$(ESLINT) .

# Check formatting.
format-check:
	@echo "Check formatting with Prettier."
	@$(PRETTIER) --check "$(PRETTIER_TARGETS)"

# Format.
format:
	@echo "Format with Prettier."
	@$(PRETTIER) --write "$(PRETTIER_TARGETS)"
