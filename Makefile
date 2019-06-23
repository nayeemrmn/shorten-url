# Environment requirements:
#   - An installation of node whose version complies with package.json.

PORT = 8000

.PHONY: all clean server

all: node_modules/

# Install node dependencies.
node_modules/: package.json
	@echo "Install node dependencies."
	@npm install
	@mkdir -p node_modules
	@touch node_modules

# Remove build files.
clean:
	@echo "Remove 'node_modules'."
	@rm -rf node_modules

# Start a server for local testing at port $(PORT).
server: node_modules/
	@echo "Start the server."
	@PORT=$(PORT) node --experimental-modules app/server.js
