ENVIRONMENT = \
	ADMIN_USERNAME=admin \
	ADMIN_PASSWORD=password \
	MONGODB_URI=mongodb://127.0.0.1:27017/shorten-url \
	PORT=8000

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
# Environment requirements:
#   - An installation of node whose version complies with package.json.
#   - A MongoDB database being served at $(MONGODB_URI).
# Protected endpoints may be accessed using credentials containing
# $(ADMIN_USERNAME):$(ADMIN_PASSWORD).
server: node_modules/
	@echo "Start the server."
	@$(ENVIRONMENT) node --experimental-modules app/server.js
