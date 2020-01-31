import React from 'react';
import { Grid, Input, Menu, Header, Icon, Container, Breadcrumb, Label, Popup, List, Button } from 'semantic-ui-react';

export default class Maid extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            isMounted: false,
            appPath: "",
            activeFolder: "",
            managedFolders: [],
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

    addManagedFolder() {
        const fs = window.require('fs')
        const path = require('path')
        const electron = require('electron');

        var updatedManagedFolders = this.state.managedFolders;

        if (this.state.managedFolders.find((folderName) => {
            return folderName === this.state.activeFolder;
        })) {
            console.log("This folder is already being managed!");
        } else {
            updatedManagedFolders.push(this.state.activeFolder);
            this.setState({ managedFolders: updatedManagedFolders });
        }
    }
    
    changeManagedFolder(e) {
        this.setState({ activeFolder: e.target.value });
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
                                onChange={(e) => this.changeManagedFolder(e)}
                                action={{ color: 'violet', content: 'Add', onClick: () => this.addManagedFolder() }}
                                actionPosition='right'
                            />
                        </Menu.Item>

                        <Menu.Item name="scan">
                            <Header as='h1'>
                                Managed folders
                                {this.state.activeFolder}
                            </Header>
                        </Menu.Item>
                        {
                            this.state.managedFolders.map(folder => {
                                return (
                                    <Menu.Item name={folder} active={this.state.activeFolder === folder} onClick={this.activateFolderItem}>
                                        <span><Icon name='right angle' /> {folder.replace('/', '\/')}</span>
                                    </Menu.Item>
                                );
                            })
                        }
                    </Menu>
                </Grid.Column>

                
            </Grid>
        );
    }
}

/*
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
                                Tags for {activeBread}
                            </Header>
                            : null
                        }
                        {
                            this.state.activeFolder !== "" ?
                            <Grid.Row>
                                <Input
                                    icon='search'
                                    iconPosition='left'
                                    type='text'
                                    placeholder='tag'
                                    onChange={this.handleChangeTag}
                                    action={{ color: 'violet', content: 'Add', onClick: this.addTagToFolder }}
                                    actionPosition='right'
                                />
                            </Grid.Row>
                            : null
                        }
                        <br/>
                        {
                            this.state.activeFolder !== "" ?
                            <Grid.Row>
                                {
                                    tagList.map(tag => {
                                        return (
                                            <Label color={colorList[Math.floor((Math.random() * 10))]} image onClick={this.addTagToInclude.bind(this, tag)}>
                                                <Icon name='tags' /> {tag}
                                            </Label>
                                        )
                                    })
                                }
                            </Grid.Row>
                            : null
                        }
                        <br />
                        {
                            this.state.activeFolder !== "" ?
                            <Grid.Row>
                                <Popup
                                    trigger={
                                        <Input
                                            icon='tags'
                                            iconPosition='left'
                                            type='text'
                                            placeholder='Search for specific tags'
                                            onChange={this.handleChangeSearchTag}
                                            action={{ color: 'olive', content: 'Search', onClick: this.addTagToSearch }}
                                            actionPosition='right'
                                        />
                                    }
                                    content='Write your tags separated by a comma, no spaces "music,work,pictures,..."'
                                    position='right center'
                                    wide='very'
                                    style={{ opacity: 0.7 }}
                                    inverted
                                />
                            </Grid.Row>
                            : null
                        }
                        <br/>
                        {
                            this.state.activeFolder !== "" ?
                            <Grid.Row>
                                {
                                    tagsToInclude.map(tag => {
                                        return (
                                            <Label color='green' image onClick={this.addTagToExclude.bind(this, tag)}>
                                                <Icon name='tags' /> {tag}
                                            </Label>
                                        )
                                    })
                                }
                                {
                                    tagsToExclude.map(tag => {
                                        return (
                                            <Label color='red' image onClick={this.deleteTagFromExclude.bind(this, tag)}>
                                                <Icon name='tags' /> {tag}
                                            </Label>
                                        )
                                    })
                                }
                            </Grid.Row>
                            : null
                        }

                        {
                            this.state.activeFolder !== "" ?
                            <Header as='h2'>
                                Navigating {active}
                            </Header>
                            : null
                        }
                        {
                            this.state.activeFolder !== ""  ?
                            <Breadcrumb>
                            {
                                breadcrumbsFolderPaths.map(folder => {
                                    if (activeBread === folder.folder) {
                                        return (
                                            <span>
                                                <Breadcrumb.Section active={activeBread === folder.folder}>
                                                    {folder.folder}
                                                </Breadcrumb.Section>
                                                <Breadcrumb.Divider icon='right angle'/>
                                            </span>
                                        );
                                    } else {
                                        return (
                                            <span>
                                                <Breadcrumb.Section link onClick={this.navigatingBread.bind(this, folder.pathToFolder)}>
                                                    {folder.folder}
                                                </Breadcrumb.Section>
                                                <Breadcrumb.Divider icon='right angle'/>
                                            </span>
                                        );
                                    }
                                })
                            }
                            </Breadcrumb>
                            : null
                        }
                        <Menu secondary>
                            {
                                this.state.activeFolder !== "" ?
                                <Grid>
                                    {
                                        folderList.map(entry => {
                                            var colorFolder = "";
                                            var numberOfInclusion = [];
                                            var numberOfExclusion = [];
                                            
                                            for (var i = 0; i < this.state.includeTag.length; i++) {
                                                if (entry.tags.includes(this.state.includeTag[i])) {
                                                    numberOfInclusion.push("true");
                                                } else {
                                                    numberOfInclusion.push("false");
                                                }
                                            }
                                            
                                            for (i = 0; i < this.state.excludeTag.length; i++) {
                                                if (entry.tags.includes(this.state.excludeTag[i])) {
                                                    numberOfExclusion.push("true");
                                                } else {
                                                    numberOfExclusion.push("false");
                                                }
                                            }

                                            if (numberOfInclusion.includes("true") && numberOfInclusion.includes("false")) {
                                                colorFolder = "olive";
                                            } else if (numberOfInclusion.includes("true")) {
                                                colorFolder = "green";
                                            } else {
                                                colorFolder = "grey";
                                            }

                                            if (numberOfExclusion.includes("true") && numberOfInclusion.includes("true")) {
                                                colorFolder = "orange";
                                            } else if (numberOfExclusion.includes("true")) {
                                                colorFolder = "red";
                                            }
                                            return (
                                                <Grid.Column width={2}>
                                                    <Menu.Item onClick={this.navigatingFolder.bind(this, entry.entry)}>
                                                        <Container textAlign='center'>
                                                                <Icon
                                                                    name='folder'
                                                                    size='huge'
                                                                    color={colorFolder}
                                                                /> <br />
                                                                {entry.entry}
                                                        </Container>
                                                    </Menu.Item>
                                                </Grid.Column>
                                            );
                                        })
                                    }
                                    {
                                        fileList.map(entry => {
                                            return (
                                                <Grid.Column width={2}>
                                                    <Menu.Item>
                                                        <Container textAlign='center'>
                                                                <Icon
                                                                    name='file outline'
                                                                    size='huge'
                                                                    color='grey'
                                                                /> <br />
                                                                {entry}
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
*/