require "acceptd/routes_base"

class Acceptd::CommonRoutes < Acceptd::RoutesBase

  get "*" do
    status 404
  end

  delete "*" do
    status 404
  end

  not_found do
    json_status 404, "Not found"
  end

  error do
    json_status 500, env['sinatra.error'].message
  end

  private

  def json_status(code, reason)
    status code

    { :status => code, :reason => reason }.to_json
  end

end
