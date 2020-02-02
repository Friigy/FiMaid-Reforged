import React from 'react';
import { Grid, Input, Menu, Header, Icon, Container, Breadcrumb, Label, Popup, List, Button } from 'semantic-ui-react';
import 'path';

export default class Maid extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            appPath: "",
            newFolder: "",
            managedFolders: [],
            activeFolder: "",
            activeBread: "",
            breadCrumb: "",
            activeFolderFolderList: {
                entry: []
            },
            activeFolderFileList: {
                entry: []
            },
            tagToSearch: "",
            includeTag: [],
            excludeTag: []
        };
    }

    componentWillMount() {
        const fs = window.require('fs')
        const path = require('path')
        const electron = require('electron');
        const appPath = (electron.app || electron.remote.app).getPath('userData');
        let content = "";

        // GET USER PROFILE
        this.setState({appPath: appPath});

        fs.readFile(path.join(appPath, "fimaidProfile.json"), (err, data) => {
            if (err) {
                console.log(err);
            } else {
                content = JSON.parse(data);
                this.setState({managedFolders: content.managedFolders});
            }
        });
    }

    addToActiveFolderFolderList(folder) {
        var newFolderFolderList = this.state.activeFolderFolderList;
        newFolderFolderList.entry.push(folder);
        this.setState({ activeFolderFolderList: newFolderFolderList });
    }

    addToActiveFolderFileList(file) {
        var newFolderFileList = this.state.activeFolderFileList;
        newFolderFileList.entry.push(file);
        this.setState({ activeFolderFileList: newFolderFileList });
    }

    checkFolderFile(pathTarget) {
        fs.stat(pathTarget, (err, stat) => {
            if(stat.isDirectory()) {
                this.addToActiveFolderFolderList(pathTarget);
            }
            if(stat.isFile()) {
                this.addToActiveFolderFileList(pathTarget);
            }
        });
    }

    readActiveDir(folder) {
        var newFolderFolderList = this.state.activeFolderFolderList;
        var newFolderFileList = this.state.activeFolderFileList;
        newFolderFolderList.entry = [];
        newFolderFileList.entry = [];

        this.setState({ activeFolderFolderList: newFolderFolderList, activeFolderFileList: newFolderFileList });

        fs.readdir(folder, (err, content) => {
            if (err) throw err;
            content.forEach(file => {
                this.checkFolderFile(path.join(folder, file));
            })
        });
    }

    addManagedFolder() {
        const fs = window.require('fs')
        const path = require('path')
        const electron = require('electron');

        var updatedManagedFolders = this.state.managedFolders;

        if (fs.existsSync(this.state.newFolder)) {
            if (this.state.managedFolders.find((folderName) => {
                return folderName === this.state.newFolder;
            })) {
                console.log("This folder is already being managed!");
            } else {
                updatedManagedFolders.push(this.state.newFolder);
                this.setState({ managedFolders: updatedManagedFolders });

                fs.writeFile(path.join(appPath, "fimaidProfile.json"), JSON.stringify({managedFolders: updatedManagedFolders}), (err) => {
                    if (err) throw err;
                    console.log("File Saved Successfully");
                });
            }

            this.readActiveDir(this.state.newFolder);

            var breadCrumb = folder.split(path.sep).pop();
            this.setState({ activeFolder: this.state.newFolder, activeBread: this.state.newFolder, breadCrumb: breadCrumb });
        } else {
            console.log("Path does not exist");
        }
    }
    
    changeInputManagedFolder(e) {
        this.setState({ newFolder: e.target.value });
    }
    
    changeActiveFolder(folder) {
        this.readActiveDir(folder);

        var breadCrumb = folder.split(path.sep).pop();
        this.setState({ activeFolder: folder, activeBread: folder, breadCrumb: breadCrumb });
    }
    
    navigateBread(bread) {
        var breadCrumb = this.state.breadCrumb;
        var tmp = breadCrumb.split(path.sep);

        for(var i = 0; i < tmp.length; i++) {
            if (tmp[i] === bread) tmp.splice(i, tmp.length - i + 1);
        }

        tmp.pop();
        breadCrumb = this.state.activeFolder + path.sep + tmp.join(path.sep);
        this.changeActiveBread(breadCrumb);
    }
    
    changeActiveBread(folder) {
        this.readActiveDir(folder);

        var tmp = folder.split(path.sep);
        for(var i = 1; i < folder.split(path.sep).length; i++) {
            if (i < this.state.activeFolder.split(path.sep).length) tmp.shift();
        }
        var breadCrumb = tmp.join(path.sep);
        this.setState({ activeBread: folder, breadCrumb: breadCrumb });
    }

    render() {
        return (
            <Grid>
                <Grid.Column width={3}>
                    <Menu fluid pointing secondary vertical>
                        <Menu.Item name="scan">
                            <Input
                                icon='folder'
                                iconPosition='left'
                                type='text'
                                placeholder='Your path here'
                                onChange={(e) => this.changeInputManagedFolder(e)}
                                action={{ color: 'violet', content: 'Add', onClick: () => this.addManagedFolder() }}
                                actionPosition='right'
                            />
                        </Menu.Item>

                        <Menu.Item name="scan">
                            <Header as='h2'>
                                Managed folders
                            </Header>
                        </Menu.Item>
                        {
                            this.state.managedFolders.map(folder => {
                                return (
                                    <Menu.Item name={folder} active={this.state.activeFolder === folder} onClick={(e) => this.changeActiveFolder(folder)}>
                                        <span><Icon name='right angle' /> {folder.toString().split(path.sep).pop()}</span>
                                    </Menu.Item>
                                );
                            })
                        }
                    </Menu>
                </Grid.Column>

                <Grid.Column stretched width={13}>
                    <Container fluid>
                        {
                            this.state.activeFolder === "" ?
                            <Header as='h2'>
                                Manage your folders
                            </Header>
                            : null
                        }
                        {
                            this.state.activeFolder === "" ?
                            <Grid.Row>
                                <Icon name='sync' size='big' color='green' /> Sync the folder
                                <Icon name='delete' size='big' color='orange' /> Stop managing the folder in this profile
                                <Icon name='trash alternate' size='big' color='red' /> Delete all management of this folder (Careful: Delete all traces of tags...)
                            </Grid.Row>
                            : null
                        }
                        {
                            this.state.activeFolder === "" ?
                            <List divided verticalAlign='middle'>
                                {
                                    this.state.managedFolders.map(folder => {
                                        return (
                                            <List.Item>
                                                <List.Content floated='right'>
                                                    <Icon name='sync' size='big' color='green'  />
                                                    <Icon name='delete' size='big' color='orange' />
                                                    <Icon name='trash alternate' size='big' color='red' />
                                                </List.Content>
                                                <List.Icon name='right angle' size='big' />
                                                <List.Content>{folder}</List.Content>
                                            </List.Item>
                                        )
                                    })
                                }
                            </List>
                            : null
                        }

                        {
                            this.state.activeFolder !== "" ?
                            <Header as='h2'>
                                {this.state.activeFolder.toString().split(path.sep).pop()}
                            </Header>
                            : null
                        }
                        {
                            this.state.activeFolder !== "" ?
                            <Breadcrumb>
                                {
                                    this.state.breadCrumb.toString().split(path.sep).map(bread => {
                                        if (bread === this.state.breadCrumb.toString().split(path.sep).pop()) {
                                            return (
                                                <span>
                                                    <Breadcrumb.Divider>{path.sep}</Breadcrumb.Divider>
                                                    <Breadcrumb.Section active={true}>{bread}</Breadcrumb.Section>
                                                </span>
                                            )
                                        } else {
                                            return (
                                                <span>
                                                    <Breadcrumb.Divider>{path.sep}</Breadcrumb.Divider>
                                                    <Breadcrumb.Section link onClick={(e) => this.navigateBread(bread)}>{bread}</Breadcrumb.Section>
                                                </span>
                                            )
                                        }
                                    })
                                }
                            </Breadcrumb>
                            : null
                        }
                        <Menu secondary style={{ overflow: "hidden" }}>
                            {
                                this.state.activeFolderItem !== "" ?
                                <Grid>
                                    {
                                        this.state.activeFolderFolderList.entry.map(entry => {
                                            return (
                                                <Grid.Column width={2}>
                                                    <Menu.Item onClick={(e) => this.changeActiveBread(entry)}>
                                                        <Container textAlign='center'>
                                                            <Icon
                                                                name='folder'
                                                                size='huge'
                                                                color='grey'
                                                            /> <br />
                                                            {entry.toString().split(path.sep).pop()}
                                                        </Container>
                                                    </Menu.Item>
                                                </Grid.Column>
                                            );
                                        })
                                    }
                                    {
                                        this.state.activeFolderFileList.entry.map(entry => {
                                            return (
                                                <Grid.Column width={2}>
                                                    <Menu.Item>
                                                        <Container textAlign='center'>
                                                            <Icon
                                                                name='file outline'
                                                                size='huge'
                                                                color='grey'
                                                            /> <br />
                                                            {entry.toString().split(path.sep).pop()}
                                                        </Container>
                                                    </Menu.Item>
                                                </Grid.Column>
                                            )
                                        })
                                    }
                                </Grid>
                                : null
                            }
                        </Menu>
                    </Container>
                </Grid.Column>                
            </Grid>
        );
    }
}
