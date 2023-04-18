import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import BoxChatTest from '../pages/box-chat-test';
import ChatApp from '../pages/chat-app';
import Conversations from '../pages/conversations';
import History from '../pages/conversations/history';
import CreateNew from '../pages/create-new';
import File from '../pages/create-new/file';
import Text from '../pages/create-new/text';
import Website from '../pages/create-new/website';
import Dashboard from '../pages/dashboard';
import DemoSaleBot from '../pages/demoSalebot';
import Home from '../pages/home';
import PageNotFound from '../pages/PageNotFound';
import Price from '../pages/price';
import Setting from '../pages/setting';
import TrainList from '../pages/trainList';
import DetailDataset from '../pages/trainList/detailDataset';
import Update from '../pages/datasets';
import UpdateWithFile from '../pages/datasets/file';
import UpdateWithWebsite from '../pages/datasets/web';
import UpdateWithText from '../pages/updateTrain/text';
import DatasetWithText from '../pages/datasets/text';
import Dataset from '../pages/datasets';

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/setting/:id" element={<Setting />} />
            <Route path="/create" element={<CreateNew />} />
            <Route path="/create/text" element={<Text />} />
            {/* <Route path="/create/file" element={<File />} />
            <Route path="/create/website" element={<Website />} /> */}
            <Route path="/chat/:chatid/dataset" element={<Dataset />} />
            <Route path="/:chatid/chat/:id/train_text" element={<DatasetWithText />} />
            <Route path="/:chatid/chat/:id/update" element={<UpdateWithText />} />
            {/* <Route path="/:chatid/chat/:id/train_file" element={<UpdateWithFile />} />
            <Route path="/:chatid/chat/:id/train_website" element={<UpdateWithWebsite />} /> */}
            <Route path="/:chatid/chat/:id" element={<BoxChatTest />} />
            <Route path="/chat-app/:id" element={<ChatApp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/conversations/:id" element={<Conversations />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/history/:id" element={<History />} />
            <Route path="/preview" element={<DemoSaleBot />} />
            <Route path="/price" element={<Price />} />
            <Route path="/list/:idbot" element={<TrainList />} />
            <Route path="/list/detail/:idDataset/:idbot" element={<DetailDataset />} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
};

export default Router;
