import {
  ArrowUpRight,
  BarChart3,
  Circle,
  Command,
  Compass,
  LayoutDashboard,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  ShoppingBag,
} from "lucide-react";
import type { Project } from "@/content/portfolio";

// Code-native mockups are illustrative concept visuals, not project screenshots.
export function ProjectVisual({ kind }: { kind: Project["kind"] }) {
  if (kind === "mobile")
    return (
      <div className="project-visual visual-mobile" aria-hidden="true">
        <div className="map-street street-one" />
        <div className="map-street street-two" />
        <div className="map-street street-three" />
        <span className="map-area">THE CITY IS YOURS.</span>
        <div className="phone-mockup">
          <div className="phone-notch" />
          <div className="phone-top">
            <span>9:41</span>
            <span>•••</span>
          </div>
          <div className="phone-app">
            <div className="phone-heading">
              <Compass size={18} />
              <b>nearby.</b>
              <span className="mini-avatar">P</span>
            </div>
            <h4>
              Find your
              <br />
              next little escape.
            </h4>
            <div className="phone-search">
              <Search size={10} />
              What’s around you?
            </div>
            <div className="phone-map">
              <div className="map-grid" />
              <span className="phone-map-pin pin-one">
                <MapPin size={18} />
              </span>
              <span className="phone-map-pin pin-two">
                <MapPin size={15} />
              </span>
              <span className="phone-map-pin pin-three">
                <MapPin size={15} />
              </span>
              <div className="map-location" />
            </div>
            <div className="phone-place">
              <div className="place-thumbnail">
                <span />
              </div>
              <div>
                <b>A place to pause</b>
                <span>Coffee & good company</span>
              </div>
              <ArrowUpRight size={13} />
            </div>
          </div>
          <div className="phone-home" />
        </div>
        <div className="mobile-visual-tag">
          <MapPin size={13} />
          Explore a little closer.
        </div>
      </div>
    );
  if (kind === "workspace")
    return (
      <div className="project-visual visual-workspace" aria-hidden="true">
        <div className="workspace-window">
          <div className="workspace-top">
            <div className="workspace-logo">
              <Command size={14} />
              <b>together</b>
              <span>/</span>
              <span>Workspace</span>
            </div>
            <span className="mini-avatar">P</span>
          </div>
          <div className="workspace-main">
            <div className="workspace-breadcrumb">WORKSPACE / PROJECTS</div>
            <div className="workspace-heading">
              <h4>
                A little progress,
                <br />
                every day.
              </h4>
              <span className="workspace-new">
                <Plus size={10} />
                New task
              </span>
            </div>
            <div className="kanban">
              {["To do", "In progress", "Done"].map((column, i) => (
                <div className="kanban-column" key={column}>
                  <div className="kanban-heading">
                    <Circle size={6} fill="currentColor" />
                    {column}
                    <span>{i === 1 ? "2" : "1"}</span>
                  </div>
                  {(i === 1 ? [0, 1] : [0]).map((task) => (
                    <div className="kanban-task" key={task}>
                      <span className={`task-label task-label-${i}`}>
                        {["Design", "Development", "Research"][i]}
                      </span>
                      <b>
                        {
                          [
                            "Map out the experience",
                            task ? "Connect the pieces" : "Build something useful",
                            "Understand the problem",
                          ][i]
                        }
                      </b>
                      <div className="task-lines">
                        <i />
                        <i />
                      </div>
                      <div className="task-bottom">
                        <span className="mini-avatar">P</span>
                        <MoreHorizontal size={12} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <span className="workspace-decoration">Small steps. Shared direction.</span>
      </div>
    );
  return (
    <div className="project-visual visual-commerce" aria-hidden="true">
      <div className="dashboard-window">
        <div className="mock-browser">
          <span />
          <span />
          <span />
          <div>studio / overview</div>
          <MoreHorizontal size={12} />
        </div>
        <div className="dashboard-layout">
          <div className="dashboard-sidebar">
            <span className="dashboard-logo">
              s<span>.</span>
            </span>
            <LayoutDashboard size={13} />
            <ShoppingBag size={13} />
            <BarChart3 size={13} />
            <span className="sidebar-bottom mini-avatar">P</span>
          </div>
          <div className="dashboard-main">
            <div className="dashboard-heading">
              <div>
                <span>YOUR BUSINESS, AT A GLANCE</span>
                <h4>A good day to grow.</h4>
              </div>
              <span className="dashboard-date">
                Overview
                <ArrowUpRight size={9} />
              </span>
            </div>
            <div className="dashboard-stats">
              <div>
                <span>Revenue</span>
                <b>₱24,850</b>
                <small>↗ 12.8%</small>
              </div>
              <div>
                <span>Orders</span>
                <b>148</b>
                <small>↗ 8.2%</small>
              </div>
              <div>
                <span>Customers</span>
                <b>96</b>
                <small>↗ 6.4%</small>
              </div>
            </div>
            <div className="dashboard-chart">
              <div>
                <b>Revenue overview</b>
                <span>This week</span>
              </div>
              <div className="chart-bars">
                {[32, 50, 41, 70, 55, 85, 73, 94, 69, 87, 100, 80].map((height, i) => (
                  <span key={i} style={{ height: `${height}%` }} />
                ))}
              </div>
              <div className="chart-labels">
                <span>MON</span>
                <span>WED</span>
                <span>FRI</span>
                <span>SUN</span>
              </div>
            </div>
            <div className="dashboard-table">
              <span>Recent activity</span>
              <div>
                <i />
                <b>Every detail, in order.</b>
                <small>Completed</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span className="mockup-note">ILLUSTRATIVE INTERFACE</span>
    </div>
  );
}
