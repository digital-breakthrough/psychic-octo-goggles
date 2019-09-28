import React, { Component } from "react";
import { Upload, Icon, message, Button } from 'antd';
import axios from "axios"
import "./index.scss";
import { Doughnut } from 'react-chartjs-2';

const { Dragger } = Upload;

const props = {
  name: 'file',
  multiple: true,
  action: 'http://localhost:3000/api/v1/upload'
};

const unicPercent = (per) => {
  return Math.abs(Math.round((100 - per) * 1000) / 1000);
}


class ComparePage extends Component {
  state = {
    files: [],
    isComparing: false,
    isReady: false,
    result: {
      persent: 0,
      params: []
    }
  }

  onChangeLoadFile(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      this.setState({
        files: [...this.state.files, {
          name: info.file.response.name,
          path: info.file.response.path
        }]
      });

    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  onStartAgain() {
    // this.setState({
    //   isReady: false,
    //   isComparing: false,
    //   result: {
    //     persent: 0,
    //     params: []
    //   },
    //   files: []
    // });
    document.location.reload(true);
  }

  onStartCheckFiles() {
    if (this.state.files.length < 2) {
      message.error('Загружено недостаточно файлов');
    } else {
      this.setState({
        isComparing: true
      });
      axios.post('http://localhost:3000/api/v1/files/compare', {
        files: this.state.files.slice(-2)
      })
        .then(res => {
          this.setState({
            isComparing: false
          });
          if (res.data.success) {
            this.setState({
              isReady: true,
              result: {
                percent: res.data.percent,
                params: res.data.params
              }
            });
            message.success(`The comparison is successful`);
          }
        })
        .catch(error => console.error('Ошибка:', error));
    }
  }

  render() {

    return (
      <main className="compare-page main">
        <div className={`files-uploader ${this.state.isReady ? 'closed' : ''}`}>
          <Dragger {...props} onChange={info => this.onChangeLoadFile(info)}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">Нажмите для загрузки файлов для сравнения</p>
            <p className="ant-upload-hint">
              Результатом работы сервиса является сравнительный анализ документов
            </p>
          </Dragger>
        </div>
        {
          this.state.isReady ? (
            <div className="send-btn text-right">
              <Button onClick={e => this.onStartAgain()}
                type="primary">Начать cначала</Button>
            </div>
          ) : (
              <div className="send-btn text-center">
                <Button onClick={e => this.onStartCheckFiles()}
                  loading={this.state.isComparing}
                  type="primary">Начать сравнение</Button>
              </div>
            )
        }
        {this.state.isReady ? (
          <>
            <div className="main-chart">
              <h2>{`${unicPercent(this.state.result.percent)} %`}</h2>
              <Doughnut width={500}
                options={
                  {
                    layout: {
                      padding: {
                        right: 450
                      }
                    }
                  }
                }
                data={{
                  labels: [
                    'Uniqueness',
                    'Plagiarism'
                  ],
                  datasets: [{
                    data: [100 - this.state.result.percent, this.state.result.percent],
                    backgroundColor: [
                      "#77f162",
                      '#FF6384'
                    ],
                    hoverBackgroundColor: [
                      "#77f162",
                      '#FF6384'
                    ]
                  }]
                }} />
            </div>
            <div className="statistic">
              {
                this.state.result.params.map(param => {
                  return (
                    <div key={param.id}>
                      <div className="column params">
                        {param.name}
                      </div>
                      <div className="column">
                        {param.value_1}
                      </div>
                      <div className="column">
                        {param.value_2}
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </>
        ) : ""}
      </main>)
  }
}

export default ComparePage;
