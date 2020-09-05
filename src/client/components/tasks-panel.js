import {html, Component} from 'https://unpkg.com/htm/preact/standalone.module.js';

/**
 * TasksPanel
 */
class TasksPanel extends Component {
  /**
   * Constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      tasksInView: [],
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    this.timer = setInterval(() => {
      this.getItems().then((data) => {
        this.setState({
          tasksInView: data.tasks,
        });
      });
    }, 2000);
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    this.timer = null;
  }

  /**
   * getItems
   */
  async getItems() {
    const response = await fetch('/active-tasks');
    return response.json();
  }

  /**
   * renderTaskRows
   */
  renderTaskRows() {
    return this.state.tasksInView.map((task) => {
      return html`
          <tr>
            <td>${task.name}</td>
            <td>${task.dispatchCount}</td>
            <td>${task.responseCount}</td>
            <td>${task.firstAttempt}</td>
            <td>${task.lastAttempt}</td>
          </tr>`;
    });
  }

  renderTable() {
    return html`
      <table>
        <thead>
          <tr>
            <th>Task name</th>
            <th>Dispatch count</th>
            <th>Response count</th>
            <th>First attempt</th>
            <th>Last attempt</th>
          </tr>
        </thead>
        <tbody>
        ${this.renderTaskRows()}
        </tbody>
      </table>
    `
  }

  /**
   * Render
   * @param {Object} props
   * @param {Object} state
   * @return {*}
   */
  render(props, state) {
    return html`
      <main class="c-output">
         <div class="toolbar">
           Active Audit Tasks
         </div>
         <div class="panel-content">
           ${(this.state.tasksInView.length > 0) ? this.renderTable() : 'No tasks in queue'}
         </div>
       </main>
        `;
  }
}


export default TasksPanel;
