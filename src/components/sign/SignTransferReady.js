import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { handleRefreshAccount, switchAccount } from '../../actions/account'
import SignAnimatedArrow from './SignAnimatedArrow'
import SignTransferDetails from './SignTransferDetails'
import SelectAccountDropdown from '../login/SelectAccountDropdown'
import Balance from '../common/Balance'
import Button from '../common/Button'

const Container = styled.div`
    max-width: 450px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'benton-sans',sans-serif;
    color: #25282A;
`

const Title = styled.div`
    font-size: 26px;
    font-weight: 600;
    margin-top: 30px;
`

const Desc = styled.div`
    font-size: 26px;
    margin-top: 20px;
`

const BalanceWrapper = styled.div`
    font-size: 26px;
    margin-top: 20px;
    font-weight: 600;
`

const MoreInfo = styled.div`
    background-color: #f5f5f5;
    border-radius: 40px;
    cursor: pointer;
    padding: 10px 50px;
    margin-top: 30px;
    height: 39px;
    position: relative;
`

const ActionsCounter = styled.div`
    height: 30px;
    width: 30px;
    background-color: orange;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 6px;
    font-size: 12px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
`

const Footer = styled.div`
    width: 100%;
    margin-top: 40px;

    @media (max-width: 767px) {
        position: fixed;
        bottom: 0;
        padding: 20px;
        background-color: white;
        border-top: 1px solid #f5f5f5;
    }
`

const ButtonWrapper = styled.div`
    display: flex;
    width: 100%;
    margin-top: 20px;

    @media (min-width: 768px) {
        margin-top: 20px;
    }

    button {
        flex: 1;

        &:last-of-type {
            margin-left: 30px;

            @media (min-width: 768px) {
                margin-left: 50px;
            }
        }
    }
`

class SignTransferReady extends Component {
    state = {
        dropdown: false,
        showMoreInfo: false
    }

    handleToggleDropdown = () => {
        this.setState(prevState => ({
            dropdown: !prevState.dropdown
        }));
    }

    handleToggleInfo = () => {
        this.setState(prevState => ({
            showMoreInfo: !prevState.showMoreInfo
        }));
    }

    handleSelectAccount = accountId => {
        this.props.switchAccount(accountId)
        this.props.handleRefreshAccount(this.props.history)
    }

    redirectCreateAccount = () => {
        this.props.history.push('/create')
    }

    renderMainView = () => {
        const {
            appTitle,
            transferTransferring,
            totalAmount,
            actionsCounter,
            account,
            handleAllow,
            handleDeny,
        } = this.props;

        return (
            <Container>
                <SignAnimatedArrow animate={transferTransferring}/>
                <Title>{appTitle || 'Unknown App'}</Title>
                <Desc>is requesting&nbsp;{totalAmount > 0 ? 'to transfer' : 'authorization'}</Desc>
                {totalAmount > 0 &&
                    <BalanceWrapper><Balance amount={totalAmount}/></BalanceWrapper>
                }
                <MoreInfo onClick={this.handleToggleInfo}>
                    More information
                    {actionsCounter &&
                        <ActionsCounter>
                            {actionsCounter > 9 ? '9+' : actionsCounter}
                        </ActionsCounter>
                    }
                </MoreInfo>
                <Footer>
                    <SelectAccountDropdown
                        handleOnClick={this.handleToggleDropdown}
                        account={account}
                        dropdown={this.state.dropdown}
                        handleSelectAccount={this.handleSelectAccount}
                        redirectCreateAccount={this.redirectCreateAccount}
                    />
                    <ButtonWrapper>
                        <Button theme='secondary' onClick={handleDeny}>Deny</Button>
                        <Button onClick={handleAllow}>Allow</Button>
                    </ButtonWrapper>
                </Footer>
            </Container>
        )

    }

    render() {
        if (this.state.showMoreInfo)
            return <SignTransferDetails handleDetails={this.handleToggleInfo}/>;
        else
            return this.renderMainView();
    }
}

const mapDispatchToProps = {
    handleRefreshAccount,
    switchAccount,
}

const mapStateToProps = ({ account, sign }) => ({
    account,
    ...sign
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignTransferReady))
