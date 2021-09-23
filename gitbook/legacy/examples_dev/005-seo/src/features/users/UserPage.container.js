import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { loadUser } from './users.service'

const mapState = ({ users }, { match }) => ({
    user: users.map[match.params.id] || null,
})

const mapDispatch = { loadUser }

const styles = {
    wrapper: {
        textAlign: 'left',
        marginLeft: 20,
        marginRight: 20,
        paddingTop: 10,
        borderTop: '4px solid #ddd',
    },
    title: {
        margin: 0,
    },
    checked: {
        textDecoration: 'line-through',
        fontStyle: 'italic',
        color: '#aaa',
    },
}

class UserPage extends React.Component {
    constructor (props) {
        super(props)
        const { match, user, loadUser } = this.props
        if (!user) loadUser(match.params.id)
    }

    render () {
        const { user } = this.props

        if (!user) return 'loading...'

        // awful data presentation
        // !!! it should be worked out with dumb components !!!
        return (
            <div style={styles.wrapper}>
                <Helmet>
                    <title>{user.name}</title>
                </Helmet>
                <h2 style={styles.title}>{user.name}</h2>
                <small>{user.email}</small>

                <h3>Todos:</h3>
                <ul>
                    {user.todos.map(({ id, title, completed }) => (
                        <li
                            key={`todo-${id}`}
                            style={completed ? styles.checked : null}
                            children={title}
                        />
                    ))}
                </ul>

                <h3>Albums:</h3>
                <ul>
                    {user.albums.map(({ id, title }) => (
                        <li key={`todo-${id}`}>
                            <Link to={`/album/${id}`}>{title}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

export default connect(mapState, mapDispatch)(UserPage)
