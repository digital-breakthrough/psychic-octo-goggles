import React, { Component } from "react";
import { Upload, Icon, message, Button, Table, Tabs } from 'antd';
import axios from "axios"

import "./index.scss";

import { Doughnut } from 'react-chartjs-2';

const { TabPane } = Tabs;
const { Dragger } = Upload;

const props = {
  name: 'file',
  multiple: false,
  action: 'http://localhost:3000/api/v1/upload'
};

const unicPercent = (per) => {
  return Math.abs(Math.round(per));
}

class HomePage extends Component {
  state = {
    fileForChecking: null,
    existingCodeBase: null,
    isComparing: false,
    isReady: false,
    result: {
      persent: 0,
      docs: [],
      columns: [],
      equalRows: 0,
      usedDependencies: [],
      matches: []
    }
  }

  onChangeLoadFileForChecking(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      this.setState({
        fileForChecking: {
          name: info.file.response.name,
          path: info.file.response.path
        }
      });
    }

    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);

    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  onChangeLoadExistingFile(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      this.setState({
        existingCodeBase: {
          name: info.file.response.name,
          path: info.file.response.path
        }
      });
    }

    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);

    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  onStartCheckFiles() {
    if (!this.state.fileForChecking) {
      message.error('Не загружен файл для проверки');
    } else
      if (!this.state.existingCodeBase) {
        message.error("Не загружена кодовая база для сверки")
      } else {
        this.setState({
          isComparing: true
        });
        axios.post('http://localhost:3000/api/v1/files/compare', {
          fileForChecking: this.state.fileForChecking,
          existingCodeBase: this.state.existingCodeBase
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
                  docs: res.data.docs,
                  columns: res.data.columns,
                  matches: res.data.matches,
                  equalRows: res.data.equalRows,
                  usedDependencies: res.data.usedDependencies
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
      <main className="home-page main">
        <div className={`files-uploader ${this.state.isReady ? 'closed' : ''}`}>
          <Dragger {...props}
            onChange={info => this.onChangeLoadFileForChecking(info)}
            showUploadList={false}>
            <p className="ant-upload-drag-icon">
              <img src="/arrow.png" alt="upload file" />
            </p>
            <p className="ant-upload-text">Исходные файлы</p>
            <p className="ant-upload-hint">
              {/* Файл содержание которого будет проверяться */}
            </p>
            <span className={`upload-file-status ${this.state.fileForChecking ? "active" : ""}`}>
              <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
            </span>
          </Dragger>
          <Dragger {...props}
            onChange={info => this.onChangeLoadExistingFile(info)}
            showUploadList={false}>
            <p className="ant-upload-drag-icon">
              <img src="/arrow.png" alt="upload file" />
            </p>
            <p className="ant-upload-text">Проверяемые файлы</p>
            <p className="ant-upload-hint">
              {/* Файл, который будет служить исходной кодовой базой */}
            </p>
            <span className={`upload-file-status ${this.state.existingCodeBase ? "active" : ""}`}>
              <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
            </span>
          </Dragger>
        </div>
        {
          this.state.isReady ? ("") : (
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
              <h3>Уникальность</h3>
              <h2>{`${unicPercent(this.state.result.percent)}%`}</h2>
              <Doughnut width={400}
                options={
                  {
                    layout: {
                      padding: {
                        right: 550,
                        top: 50
                      }
                    }
                  }
                }
                data={{
                  labels: [
                    'Уникальность',
                    'Плагиат'
                  ],
                  datasets: [{
                    data: [this.state.result.percent, 100 - this.state.result.percent],
                    backgroundColor: [
                      "#0ECC80",
                      '#DE3A3A'
                    ],
                    hoverBackgroundColor: [
                      "#0ECC80",
                      '#DE3A3A'
                    ]
                  }]
                }} />
            </div>
            <div className="statistic">
              <div className="statistic-block">
                <div className="column">
                  <div className="column__main">
                    <div className="title">
                      Обнаруженные зависимости
                    </div>
                    <div className="more">
                      Подробнее
                    </div>
                  </div>
                  <div className="column__num">
                    <div className="num__shadow">{this.state.result.usedDependencies.length} </div>
                  </div>
                </div>
                <div className="column">
                  <div className="column__main">
                    <div className="title">
                      Обнаруженные зависимости
                    </div>
                    <div className="more">
                      Подробнее
                    </div>
                  </div>
                  <div className="column__num">
                    <div className="num__shadow">{this.state.result.equalRows}</div>
                  </div>
                </div>
              </div>
              <Tabs defaultActiveKey="1">
                <TabPane tab="Общая информация" key="1">
                  <Table dataSource={this.state.result.docs} columns={this.state.result.columns} />
                </TabPane>
                <TabPane tab="Обнаруженные зависимости" key="2">
                  <Table dataSource={this.state.result.usedDependencies} columns={[{
                    title: 'Зависимость',
                    dataIndex: "title",
                    key: "title"
                  }, {
                    title: 'Источник',
                    dataIndex: "source",
                    key: "source"
                  }]} />
                </TabPane>
                <TabPane tab="Совпадение строк" key="3">
                  <Table dataSource={this.state.result.matches} columns={[{
                      title: '№ строки пр. файла',
                      dataIndex: "checkFileRowId",
                      key: "checkFileRowId"
                    }, {
                      title: '№ строки в код. базе',
                      dataIndex: "existingFileRowId",
                      key: "existingFileRowId"
                    }, {
                      title: "Найденная совпадающая строка",
                      dataIndex: "row",
                      key: "row"
                    }]} />      
                </TabPane>
              </Tabs>
            </div>
          </>
        ) : ""}
      </main>)
  }
}

export default HomePage;
