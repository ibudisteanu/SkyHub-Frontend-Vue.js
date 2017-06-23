/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/10/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>
  <ul class="nav navbar-top-links navbar-right">


    <li>
      <Link to="/">
      <i class="fa fa-home"></i>
      <span class="m-r-sm text-muted welcome-message">Home</span>
      </Link>
    </li>

    <li>
      <Link to="/">
      <i class="fa fa-home"></i>
      <span class="m-r-sm text-muted welcome-message">Profile</span>
      </Link>
    </li>


    <NotificationMenu/>


    <li class="dropdown">
      <a class="dropdown-toggle count-info" data-toggle="dropdown" href="#">
        <i class="fa fa-bell"></i>  <span class="label label-primary">8</span>
      </a>
      <ul class="dropdown-menu dropdown-alerts">
        <li>
          <a href="mailbox.html">
            <div>
              <i class="fa fa-envelope fa-fw"></i> You have 16 messages
              <span class="pull-right text-muted small">4 minutes ago</span>
            </div>
          </a>
        </li>
        <li class="divider"></li>
        <li>
          <a href="profile.html">
            <div>
              <i class="fa fa-twitter fa-fw"></i> 3 New Followers
              <span class="pull-right text-muted small">12 minutes ago</span>
            </div>
          </a>
        </li>
        <li class="divider"></li>
        <li>
          <a href="grid_options.html">
            <div>
              <i class="fa fa-upload fa-fw"></i> Server Rebooted
              <span class="pull-right text-muted small">4 minutes ago</span>
            </div>
          </a>
        </li>
        <li class="divider"></li>
        <li>
          <div class="text-center link-block">
            <a href="notifications.html">
              <strong>See All Alerts</strong>
              <i class="fa fa-angle-right"></i>
            </a>
          </div>
        </li>
      </ul>
    </li>


    <li>
      <Link to="/logout" onClick={::this.handleLogout}>
      <i class="fa fa-sign-out"></i> Log out
      </Link>
    </li>

    <li>
      <a class="right-sidebar-toggle">
        <i class="fa fa-tasks"></i>
      </a>
    </li>

  </ul>
</template>

<script>
  export default {
      name: 'Header-Navigation-Menu-Authenticated',
      computed:{
          
      }
  }
</script>
