import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from "react-router-dom";

export default class NavBar extends React.Component {
    constructor(props, context) {
        super(props, context);
        
        this.state = {
            activeItem: 'home'
        };
    }
  
    handleItemClick(name) {
        this.setState({ activeItem: name })
    }

    render() {
        return (
            <div className="NavBar">
                <Menu pointing secondary>
                    <Menu.Item name='home' active={this.state.activeItem === 'home'} onClick={(e, {name}) => this.handleItemClick(name)}>
                        <Link style={{ textDecoration: 'none' }} to="/">Home</Link>
                    </Menu.Item>
                    <Menu.Item name='maid' active={this.state.activeItem === 'maid'} onClick={(e, {name}) => this.handleItemClick(name)}>
                        <Link style={{ textDecoration: 'none' }} to="/maid">Manage Folders</Link>
                    </Menu.Item>
                    <Menu.Menu position='right'>
                        <Menu.Item name='settings' active={this.state.activeItem === 'settings'} onClick={(e, {name}) => this.handleItemClick(name)}>
                            <Link style={{ textDecoration: 'none' }} to="/settings">Settings</Link>
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
            </div>
        );
    }
}