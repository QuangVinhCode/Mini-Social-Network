import React from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    let dispatch = useDispatch();
    return (
      <Component {...props} router={{ location, navigate, params, dispatch }} />
    );
  }
  return ComponentWithRouterProp;
}

export default withRouter;
