require 'compass/import-once/activate'

require 'compass/import-once/importer'
module Compass::ImportOnce::Importer
	def find(uri, options, *args)
		uri, force_import = handle_force_import(uri.gsub(/^\(NOT IMPORTED\) /, ''))
		maybe_replace_with_dummy_engine(super(uri, options, *args), options, force_import)
	end
end

# css_dir = "dev/css"
# sass_dir = "dev/blocks"
# images_dir = "images"
# javascripts_dir = "js"
# fonts_dir = "fonts"

# output_style = :compressed

# relative_assets = true