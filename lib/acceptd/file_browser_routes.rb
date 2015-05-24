require "acceptd/routes_base"

class Acceptd::FileBrowserRoutes < Acceptd::RoutesBase

  get "/file_browser/tree" do
    tree = []

    id = params[:id].to_i

    p id

    if id == 1
      tree << process_node(File.expand_path("lib"))
    else
      tree << process_node("lib/acceptd")
      tree << process_node("lib/views")
      tree << process_node("lib/accepts.rb")
    end

    tree.to_json
  end

  get "/file_browser/resource" do
    tree = []

    tree.to_json
  end

  private

  def process_node file
    {
        id: File.path(file),
        text: File.basename(file),
        icon: File.directory?(file) ? 'jstree-custom-folder' : 'jstree-custom-file',
        state: {
            opened: "false",
            disabled: "false",
            selected: "false"
        },
        li_attr: {
            base: File.path(file),
            isLeaf: "#{!File.directory?(file)}"
        },
        children: "#{File.directory?(file)}"
    }
  end
end
