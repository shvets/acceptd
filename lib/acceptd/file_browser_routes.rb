require "acceptd/routes_base"

class Acceptd::FileBrowserRoutes < Acceptd::RoutesBase

  get "/file_browser/tree" do
    content_type :json

    if params[:id] == "1"
      tree = []

      directories(ENV['HOME']).each do |dir|
        tree << process_node(dir)
      end

      tree.to_json
    else
      tree = []

      directories(params[:id]).each do |dir|
        tree << process_node(dir)
      end

      tree.to_json

      tree.to_json
    end
  end

  get "/file_browser/node" do
    content_type :json

    tree = []

    tree.to_json
  end

  private

  def directories root
    Dir.glob("#{root}/*").select { |f| File.directory? f }.map { |f| f.gsub("//", "/") }
  end

  def process_node file
    {
        id: File.path(file),
        text: File.basename(file),
        icon: File.directory?(file) ? 'jstree-custom-folder' : 'jstree-custom-file',
        state: {
            opened: false,
            disabled: false,
            selected: false
        },
        li_attr: {
            base: File.path(file),
            isLeaf: !File.directory?(file)
        },
        children: File.directory?(file)
    }
  end
end
