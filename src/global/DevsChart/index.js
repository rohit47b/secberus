// eslint-disable-next-line
import React, { Fragment, PureComponent } from "react";
import ReactDOM from "react-dom";
import joint from "jointjs";
import { InfiniteLoader } from "react-virtualized"

import { store } from 'client'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { cloneDeep, debounce } from "lodash"

import * as assetsActions from 'actions/assetsAction'
import { showMessage } from 'actions/messageAction'

import { fetchServiceIconPath } from 'utils/serviceIcon'

const graph = new joint.dia.Graph();
// eslint-disable-next-line
const graphBBox = joint.layout.DirectedGraph.layout(graph, {
  nodeSep: 50,
  edgeSep: 80,
  rankDir: "TB"
});
class DevsChart extends PureComponent {
  _mounted = false
  // eslint-disable-next-line
  /*constructor(props) {
    super(props);
  }*/

  state = {
    dataList: []
  };

  buildDecorate = (divWidth, divHeight, refXValue, refYValue, refWidthValue, refHeightValue, textValue, imageValue, refXText, refYText) => {
    joint.shapes.basic.DecoratedRect = joint.shapes.basic.Generic.extend({
      markup: '<g class="rotatable"><g class="scalable"><rect/></g><image/><text/></g>',
      defaults: joint.util.deepSupplement({
        type: 'basic.DecoratedRect',
        attrs: {
          'rect': { fill: 'none', width: divWidth, height: divHeight },
          'text': { 'font-size': 14, text: '', 'ref-x': refXText, 'ref-y': refYText, ref: 'rect', 'y-alignment': 'middle', 'x-alignment': 'middle', fill: 'black' },
          'image': { 'ref-x': refXValue, 'ref-y': refYValue, ref: 'rect', refWidth: refWidthValue, refHeight: refHeightValue }
        }
      }, joint.shapes.basic.Generic.prototype.defaults)
    });

    var decorateObject = new joint.shapes.basic.DecoratedRect({
      position: { x: 0, y: 0 },
      size: { width: divWidth, height: divHeight },
      attrs: {
        text: { text: textValue },
        image: { 'xlink:href': imageValue }
      }
    });

    return decorateObject;
  }

  buildDecorateItems = (refXValue, refYValue, textValue, imageValue, divWidth, divHeight) => {
    joint.shapes.basic.DecoratedRect = joint.shapes.basic.Generic.extend({
      markup: '<g class="rotatable"><g class="scalable"><rect/></g><image/><text/></g>',
      defaults: joint.util.deepSupplement({
        type: 'basic.DecoratedRect',
        attrs: {
          'rect': { fill: 'none', width: divWidth * 0.15, height: divHeight * 0.15 },
          'text': { 'font-size': divWidth * 0.10 + '%', text: '', 'ref-x': 0, 'ref-y': divHeight * 0.1, ref: 'rect', fill: 'black' },
          'image': { ref: 'rect', refWidth: '70%', refHeight: '60%' }
        }
      }, joint.shapes.basic.Generic.prototype.defaults)
    });

    var decorateObject = new joint.shapes.basic.DecoratedRect({
      position: { x: refXValue, y: refYValue },
      size: { width: divWidth * 0.15, height: divHeight * 0.15 },
      attrs: {
        text: { text: textValue },
        image: { 'xlink:href': imageValue }
      }
    });

    return decorateObject;
  }

  validateLength = (text, line=1) => {
    var maxLength = 25;
    if (text.length > maxLength) {
      if (line <= 2) {
        text = text.slice(0, maxLength) + '\n' + this.validateLength(text.slice(maxLength), line + 1);
      } else {
        text = text.slice(0, maxLength-3) + '...'
      }
    };
    return text;
  }

  buildTextValue = (data, service) => {
    var stringResult = '';
    switch (service) {
      case "s3":
        stringResult = this.validateLength('Bucket: ' + data['name']);
        break;
      case "sqs":
        stringResult = this.validateLength('Queue: ' + data['name']);
        break;
      case "elasticsearch":
        stringResult = this.validateLength('Domain: ' + data['name']);
        break;
      case "acm":
        stringResult = this.validateLength('Credential: ' + data['name']);
        break;
      case "ec2":
        stringResult = this.validateLength('Hostname: ' + data['name']) + '\n';
        stringResult += this.validateLength('Internal Ip: ' + data['internal_ip']) + '\n';
        stringResult += this.validateLength('External Ip: ' + data['ipv4']);
        break;
      case "cloud-front":
        stringResult = this.validateLength('Distribution: ' + data['name']);
        break;
      case "sns":
        stringResult = this.validateLength('Topic ARN: ' + data['name']);
        break;
      case "rds":
        stringResult = this.validateLength('Instance: ' + data['name']);
        break;
      case "redshift":
        stringResult = this.validateLength('Cluster: ' + data['name']);
        break;
      case "cloud-formation":
        stringResult = this.validateLength('Stack: ' + data['name']);
        break;
      default: 
        stringResult = this.validateLength('Name: ' + data['name']);
    }

    return stringResult;
  }

  generateDiagram = () => {
    var data = this.state.dataList;
    var divWidth = 0;
    var divHeight = 0;

    if (document.getElementById('diagram') !== null) {
      var divWidth = document.getElementById('diagram').offsetWidth;
      var divHeight = document.getElementById('diagram').offsetHeight;
    }

    if (divHeight === 0) {
      divHeight = divWidth * 0.75;
    };
    // eslint-disable-next-line
    var paper = new joint.dia.Paper({
      el: ReactDOM.findDOMNode(this.refs.placeholder),
      width: divWidth,
      height: divHeight,
      gridSize: 1,
      model: graph,
      snapLinks: true,
      linkPinning: true,
      embeddingMode: true,
      highlighting: {
        default: {
          name: "stroke",
          label: "hi",
          options: {
            padding: 6
          }
        },
        embedding: {
          name: "addClass",
          options: {
            className: "highlighted-parent"
          }
        }
      },

      validateEmbedding: function (childView, parentView) {
        return parentView.model instanceof joint.shapes.devs.Coupled;
      },

      validateConnection: function (
        sourceView,
        sourceMagnet,
        targetView,
        targetMagnet
      ) {
        return sourceMagnet !== targetMagnet;
      }
    });

    var xPos = 10;
    var yPos = 9;
    var vol = (divWidth * divHeight) / 40
    for (var x = 0; x < data.length; x++) {
      var instance = []
      var textInfo = this.buildTextValue(data[x], this.props.service);
      instance[x] = this.buildDecorateItems(xPos, yPos, textInfo, fetchServiceIconPath('icon-' + this.props.service), divWidth, divHeight);
      graph.addCell(instance[x]);

      xPos += divWidth * 0.25;
      if (xPos >= divWidth - 58) {
        yPos += divHeight * 0.2;
        xPos = 10;
      }
    };
  }

  fetchAssets = debounce(this.fetchAssets, 500);
  currentValue = this.props.filterData

  componentDidMount() {
    this._mounted = true
    const filterData = this.props.filterData
    if (filterData.selectAccount.id !== 'all' && filterData.selectAccount.id !== undefined) {
      this._mounted = false
      this.fetchAssets()
      document.getElementsByTagName("BODY")[0].onresize = () => this.generateDiagram();

    }


    this.unsubscribe = store.subscribe(this.receiveFilterData)
  }

  componentWillUnmount() {
    this._mounted = false
  }

  static getDerivedStateFromProps(nextProps, state) {
    return { service: nextProps.service }
  }


  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.service !== prevProps.service) {
      this.setState({ service: prevProps.service }, () => {
        this.fetchAssets()
      })
    }
  }


  receiveFilterData = data => {
    const currentState = store.getState()
    const previousValue = this.currentValue
    this.currentValue = currentState.uiReducer.filterData

    if (
      this.currentValue &&
      previousValue !== this.currentValue
    ) {
      const filterData = cloneDeep(currentState.uiReducer.filterData)
      if (filterData.selectAccount.id !== 'all' && this._mounted) {
        this.fetchAssets()
      }
    }
  }


    fetchAssets() {
      let payload = {
        "account_id": this.props.filterData.selectAccount.id,
        "service": [this.props.service]
      }
      
      if (this.props.service == 'ec2') {
        payload['search'] = "Ec2GetInstance"
      }

      if (this.props.service == 'vpc') {
        payload['search'] = "VpcDescribeVpcs"
      }

      this.props.actions.fetchAssets(payload).
        then(result => {
          this._mounted = true
          if (result.success) {
            this.setState({ dataList: result.data },()=>{
              document.getElementsByTagName("BODY")[0].onresize = () => this.generateDiagram();
              this.generateDiagram()
            });
          } else {
            let message = { message: result, showSnackbarState: true, variant: 'error' }
            this.props.showMessage(message)

          }
        });
    }
  

  render() {
    return (<div id="diagram" className="App">
      <div ref="placeholder" />
    </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, assetsActions), dispatch),
    showMessage: message => {
      dispatch(showMessage(message))
    }
  };
}

const mapStateToProps = (state, ownProps) => ({
  filterData: state.uiReducer.filterData,
})


export default withRouter((connect(mapStateToProps, mapDispatchToProps)(DevsChart)));
//export default DevsChart;