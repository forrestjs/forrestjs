import React from 'react'
import { connect } from 'react-redux'
import { loadUsers } from './users.service'

const mapState = ({ users }) => users

const mapDispatch = { loadUsers }

const styles = {
    error: { color: '#f00' },
    list: { textAlign: 'left' },
}

class Users extends React.Component {
    constructor (props) {
        super(props)
        const { list, loadUsers } = this.props
        if (!list.length) loadUsers()
    }

    render () {
        if (this.props.isLoading) {
            return <div>loading...</div>
        }

        if (this.props.errorMsg) {
            return (
                <div style={styles.error}>
                    {this.props.errorMsg}
                </div>
            )
        }

        return (
            <ul style={styles.list}>
                {this.props.list.map(user => (
                    <li key={`user-${user.id}`}>{user.name}</li>
                ))}
            </ul>
        )
    }
}

export default connect(mapState, mapDispatch)(Users)
